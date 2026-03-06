import { sqlite, pgPool } from "./prisma"

// NOTE: table names follow your existing SQL migrations (quoted where needed)

function genId() {
  return (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now())
}

export async function getUserByEmail(email: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM "users" WHERE email = $1', [email])
      return res.rows[0] ?? null
    } catch (e) {
      console.warn('pg getUserByEmail failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) {
    console.warn('getUserByEmail: sqlite not available in this environment')
    return null
  }
  const stmt = sqlite.prepare('SELECT * FROM "users" WHERE email = ?')
  const row = stmt.get(email)
  return row ?? null
}

export async function getUserById(id: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM "users" WHERE id = $1', [id])
      return res.rows[0] ?? null
    } catch (e) {
      console.warn('pg getUserById failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) {
    console.warn('getUserById: sqlite not available in this environment')
    return null
  }
  const stmt = sqlite.prepare('SELECT * FROM "users" WHERE id = ?')
  return stmt.get(id) ?? null
}

export async function createUser(data: { name: string; email: string; password: string; phone?: string; role?: string }) {
  const id = genId()
  const now = new Date().toISOString()
  const role = data.role ?? 'STUDENT'

  if (pgPool) {
    try {
      const res = await pgPool.query(
        'INSERT INTO "users"(id, name, email, password, phone, role, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [id, data.name, data.email, data.password, data.phone ?? null, role, now, now]
      )
      return res.rows[0] ?? null
    } catch (e) {
      console.warn('pg createUser failed, falling back to sqlite:', e)
    }
  }

  if (!sqlite) {
    console.warn('createUser: sqlite not available, skipping insert')
    return null
  }
  sqlite.prepare(
    `INSERT INTO "users"(id, name, email, password, phone, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.email, data.password, data.phone ?? null, role, now, now)
  return getUserById(id)
}

export async function getCourseBySlug(slug: string) {
  // Prefer Postgres when available
  if (pgPool) {
    try {
      // Try capitalized table, then lowercase
      const res = await pgPool.query('SELECT * FROM "Course" WHERE slug = $1 LIMIT 1', [slug])
      let course = (res.rows && res.rows[0]) ?? null
      if (!course) {
        const res2 = await pgPool.query('SELECT * FROM "courses" WHERE slug = $1 LIMIT 1', [slug])
        course = (res2.rows && res2.rows[0]) ?? null
      }
      if (!course) return null

      // load modules
      const modsRes = await pgPool.query('SELECT * FROM "Module" WHERE "courseId" = $1 ORDER BY position ASC', [course.id])
      const modules = modsRes.rows || []
      for (const mod of modules) {
        const lessonsRes = await pgPool.query('SELECT * FROM "Lesson" WHERE "moduleId" = $1 ORDER BY "createdAt" ASC', [mod.id])
        const lessonsRows: any[] = lessonsRes && lessonsRes.rows ? lessonsRes.rows : [];
        (mod as any).lessons = lessonsRows;
        if ((mod as any).position !== undefined && (mod as any).order === undefined) {
          (mod as any).order = (mod as any).position
        }
      }
      ;(course as any).modules = modules
      return course
    } catch (e) {
      console.warn('pg getCourseBySlug failed, falling back to sqlite:', e)
    }
  }

  // Try capitalized table first (existing SQL), fall back to lowercase compatibility table
  const stmt = sqlite.prepare('SELECT * FROM "Course" WHERE slug = ?')
  let course = stmt.get(slug) ?? null
  if (!course) {
    try {
      const stmt2 = sqlite.prepare('SELECT * FROM "courses" WHERE slug = ?')
      course = stmt2.get(slug) ?? null
    } catch (e) {
      // ignore if table doesn't exist
      course = course ?? null
    }
  }

  if (!course) return null

  // Load modules (ordered by position) and attach lessons for each module
  try {
    if (!sqlite) {
      (course as any).modules = []
      return course
    }
    const modulesStmt = sqlite.prepare('SELECT * FROM "Module" WHERE courseId = ? ORDER BY position ASC')
    const lessonsStmt = sqlite.prepare('SELECT * FROM "Lesson" WHERE moduleId = ? ORDER BY createdAt ASC')
    const modulesRaw = (course && typeof course === 'object' && course !== null && 'id' in course) ? modulesStmt.all((course as any).id) || [] : []
    type Lesson = { id: string; moduleId: string; title: string; [key: string]: any };
    type Module = { id: string; courseId: string; title: string; lessons?: Lesson[]; [key: string]: any };
    const modules: Module[] = Array.isArray(modulesRaw) ? modulesRaw as Module[] : [];

    for (const mod of modules) {
      // Map position → order for client compatibility
      if (mod.position !== undefined && mod.order === undefined) {
        (mod as any).order = mod.position;
      }
      const lessonsRaw = lessonsStmt.all(mod.id) || [];
      const lessons: Lesson[] = Array.isArray(lessonsRaw) ? lessonsRaw as Lesson[] : [];
      mod.lessons = lessons;
    }

    (course as any).modules = modules;
  } catch (e) {
    // If Module/Lesson tables aren't present, ensure modules is at least an empty array
    (course as any).modules = []
  }

  return course
}

export async function getEnrollmentByUserCourse(userId: string, courseId: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM "Enrollment" WHERE "userId" = $1 AND "courseId" = $2 LIMIT 1', [userId, courseId])
      return (res.rows && res.rows[0]) ?? null
    } catch (e) {
      console.warn('pg getEnrollmentByUserCourse failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return null
  try {
    return sqlite.prepare('SELECT * FROM "Enrollment" WHERE userId = ? AND courseId = ?').get(userId, courseId) ?? null
  } catch (e) {
    try { return sqlite.prepare('SELECT * FROM "enrollments" WHERE userId = ? AND courseId = ?').get(userId, courseId) ?? null } catch (e2) { return null }
  }
}

export async function getProgressForUserCourse(userId: string, courseId: string) {
  if (pgPool) {
    try {
      // Join Progress -> Lesson -> Module
      const res = await pgPool.query(`SELECT p.* FROM "Progress" p JOIN "Lesson" l ON l.id = p."lessonId" JOIN "Module" m ON m.id = l."moduleId" WHERE p."userId" = $1 AND m."courseId" = $2`, [userId, courseId])
      return res.rows || []
    } catch (e) {
      console.warn('pg getProgressForUserCourse failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return []
  try {
    const stmt = sqlite.prepare(`
      SELECT p.* 
      FROM "Progress" p
      JOIN "Lesson" l ON l.id = p.lessonId
      JOIN "Module" m ON m.id = l.moduleId
      WHERE p.userId = ? AND m.courseId = ?
    `)
    const rows = stmt.all(userId, courseId) || []
    return rows
  } catch (e) {
    return []
  }
}

export async function getTopPublishedCourses(limit = 3) {
  // Return top `limit` published courses. Prefer Postgres when available.
  if (pgPool) {
    try {
      const res = await pgPool.query(
        'SELECT id, title, slug, description, thumbnail, price, duration, level, category, "createdAt", "isPublished" FROM "Course" WHERE "isPublished" = 1 ORDER BY "createdAt" DESC LIMIT $1',
        [limit]
      )
      return res.rows ?? []
    } catch (e) {
      console.warn('pg getTopPublishedCourses failed, falling back to sqlite:', e)
    }
  }

  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category, createdAt, isPublished FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC LIMIT ?`).all(limit)
    if (Array.isArray(rows)) return rows
    return []
  } catch (e) {
    try {
      const rows2 = sqlite.prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category, createdAt, isPublished FROM courses WHERE isPublished = 1 ORDER BY createdAt DESC LIMIT ?`).all(limit)
      if (Array.isArray(rows2)) return rows2
    } catch (e2) {}
    return []
  }
}

export async function getPublishedCoursesWithCounts() {
  // Returns published courses with module and enrollment counts
  if (pgPool) {
    try {
      const coursesRes = await pgPool.query('SELECT id, title, slug, description, thumbnail, price, duration, level, category FROM "Course" WHERE "isPublished" = 1 ORDER BY "createdAt" DESC')
      const courses = coursesRes.rows || []
      if (!courses.length) return []

      const ids = courses.map((c: any) => c.id)
      // module counts
      const modulesRes = await pgPool.query('SELECT "courseId" as courseId, COUNT(*) as cnt FROM "Module" WHERE "courseId" = ANY($1) GROUP BY "courseId"', [ids])
      const enrollRes = await pgPool.query('SELECT "courseId" as courseId, COUNT(*) as cnt FROM "Enrollment" WHERE "courseId" = ANY($1) GROUP BY "courseId"', [ids])
      const modMap: Record<string, number> = {}
      for (const r of modulesRes.rows || []) modMap[r.courseid || r.courseId] = Number(r.cnt)
      const enMap: Record<string, number> = {}
      for (const r of enrollRes.rows || []) enMap[r.courseid || r.courseId] = Number(r.cnt)

      return courses.map((c: any) => ({
        ...c,
        description: c.description ?? '',
        thumbnail: c.thumbnail ?? null,
        price: c.price ?? 0,
        duration: c.duration ?? '',
        level: c.level ?? '',
        category: c.category ?? '',
        _count: { enrollments: enMap[c.id] ?? 0, modules: modMap[c.id] ?? 0 },
      }))
    } catch (e) {
      console.warn('pg getPublishedCoursesWithCounts failed, falling back to sqlite:', e)
    }
  }

  if (!sqlite) return []
  try {
    const coursesRaw = sqlite.prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC`).all()
    const courses: any[] = Array.isArray(coursesRaw) ? coursesRaw : []
    return courses.map((c: any) => {
      const moduleCount = (sqlite.prepare(`SELECT COUNT(*) as cnt FROM "Module" WHERE courseId = ?`).get(c.id) as any)?.cnt ?? 0
      const enrollmentCount = (sqlite.prepare(`SELECT COUNT(*) as cnt FROM "Enrollment" WHERE courseId = ?`).get(c.id) as any)?.cnt ?? 0
      return {
        ...c,
        description: c.description ?? '',
        thumbnail: c.thumbnail ?? null,
        price: c.price ?? 0,
        duration: c.duration ?? '',
        level: c.level ?? '',
        category: c.category ?? '',
        _count: { enrollments: enrollmentCount, modules: moduleCount },
      }
    })
  } catch (e) {
    return []
  }
}

export async function createEnrollment(args: { userId: string; courseId: string }) {
  const id = genId()
  const now = new Date().toISOString()
  if (pgPool) {
    try {
      const res = await pgPool.query(
        'INSERT INTO "Enrollment"(id, "userId", "courseId", status, progress, "enrolledAt") VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [id, args.userId, args.courseId, 'active', 0, now]
      )
      try {
        await pgPool.query('INSERT INTO enrollments(id, "userId", "courseId", status, progress, "enrolledAt") VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING', [id, args.userId, args.courseId, 'active', 0, now])
      } catch (e) {}
      return (res.rows && res.rows[0]) ?? null
    } catch (e) {
      console.warn('pg createEnrollment failed, falling back to sqlite:', e)
    }
  }

  sqlite.prepare(
    `INSERT INTO "Enrollment"(id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, 'active', 0, ?)`
  ).run(id, args.userId, args.courseId, now)
  // also insert into lowercase table if present
  try {
    sqlite.prepare(`INSERT OR IGNORE INTO "enrollments"(id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, 'active', 0, ?)`)
      .run(id, args.userId, args.courseId, now)
  } catch (e) {}
  return sqlite.prepare('SELECT * FROM "Enrollment" WHERE id = ?').get(id)
}

export async function getPaymentById(id: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM "Payment" WHERE id = $1 LIMIT 1', [id])
      if (res.rows && res.rows.length) return res.rows[0]
      const res2 = await pgPool.query('SELECT * FROM payments WHERE id = $1 LIMIT 1', [id])
      return (res2.rows && res2.rows[0]) ?? null
    } catch (e) {
      console.warn('pg getPaymentById failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return null
  try {
    try { return sqlite.prepare('SELECT * FROM "payments" WHERE id = ?').get(id) } catch (e) {}
    try { return sqlite.prepare('SELECT * FROM "Payment" WHERE id = ?').get(id) } catch (e) { return null }
  } catch (e) {
    return null
  }
}

export async function updatePaymentStatus(id: string, status: string, providerId?: string) {
  if (pgPool) {
    try {
      await pgPool.query('UPDATE "Payment" SET status = $1, "providerId" = $2 WHERE id = $3', [status, providerId ?? null, id])
      try { await pgPool.query('UPDATE payments SET status = $1, providerId = $2 WHERE id = $3', [status, providerId ?? null, id]) } catch (e) {}
      return true
    } catch (e) {
      console.warn('pg updatePaymentStatus failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return false
  try {
    try { sqlite.prepare('UPDATE "Payment" SET status = ?, providerId = ? WHERE id = ?').run(status, providerId ?? null, id); return true } catch (e) {}
    try { sqlite.prepare('UPDATE "payments" SET status = ?, providerId = ? WHERE id = ?').run(status, providerId ?? null, id); return true } catch (e) { return false }
  } catch (e) {
    return false
  }
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number) {
  const now = new Date().toISOString()
  sqlite.prepare(
    `UPDATE "Enrollment" SET progress = ?, updatedAt = ? WHERE id = ?`
  ).run(progress, now, enrollmentId)
  try {
    sqlite.prepare(`UPDATE "enrollments" SET progress = ?, updatedAt = ? WHERE id = ?`).run(progress, now, enrollmentId)
  } catch (e) {}
  return sqlite.prepare('SELECT * FROM "Enrollment" WHERE id = ?').get(enrollmentId)
}

export async function countUsersByRole(role = 'STUDENT') {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT COUNT(1) as cnt FROM "users" WHERE role = $1', [role])
      return Number((res.rows && res.rows[0] && res.rows[0].cnt) ?? 0)
    } catch (e) {
      console.warn('pg countUsersByRole failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return 0
  try { const row = sqlite.prepare('SELECT COUNT(1) as cnt FROM "users" WHERE role = ?').get(role) as any; return Number(row?.cnt ?? 0) } catch (e) { return 0 }
}

export async function countCourses() {
  if (pgPool) {
    try { const res = await pgPool.query('SELECT COUNT(1) as cnt FROM "Course"'); return Number((res.rows && res.rows[0] && res.rows[0].cnt) ?? 0) } catch (e) { console.warn('pg countCourses failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return 0
  try { const row = sqlite.prepare('SELECT COUNT(1) as cnt FROM "Course"').get() as any; return Number(row?.cnt ?? 0) } catch (e) { return 0 }
}

export async function countEnrollments() {
  if (pgPool) {
    try { const res = await pgPool.query('SELECT COUNT(1) as cnt FROM "Enrollment"'); return Number((res.rows && res.rows[0] && res.rows[0].cnt) ?? 0) } catch (e) { console.warn('pg countEnrollments failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return 0
  try { const row = sqlite.prepare('SELECT COUNT(1) as cnt FROM "Enrollment"').get() as any; return Number(row?.cnt ?? 0) } catch (e) { return 0 }
}

export async function ensureCourseExists(data: { title: string; slug: string; description?: string; price?: number; duration?: string | number; level?: string; category?: string; thumbnail?: string | null; isPublished?: number }) {
  const existing = await getCourseBySlug(data.slug)
  if (existing) return existing
  return await createCourse({ title: data.title, slug: data.slug, description: data.description, thumbnail: data.thumbnail ?? null, price: data.price ?? 0, duration: data.duration ?? '', level: data.level ?? '', category: data.category ?? '', isPublished: data.isPublished ?? 0 })
}

export async function getRecentEnrollments(limit = 10) {
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT e.id, e."userId", e."courseId", e.status, e.progress, e."enrolledAt",
                u.name as "userName", u.email as "userEmail",
                c.title as "courseTitle",
                (SELECT COUNT(l.id) FROM "Lesson" l JOIN "Module" m ON m.id = l."moduleId" WHERE m."courseId" = e."courseId") as total_lessons,
                (SELECT COUNT(p.id) FROM "Progress" p JOIN "Lesson" l ON l.id = p."lessonId" JOIN "Module" m ON m.id = l."moduleId" WHERE p."userId" = e."userId" AND m."courseId" = e."courseId" AND p.completed = 1) as completed_lessons
         FROM "Enrollment" e
         LEFT JOIN "users" u ON u.id = e."userId"
         LEFT JOIN "Course" c ON c.id = e."courseId"
         ORDER BY e."enrolledAt" DESC
         LIMIT $1`,
        [limit]
      )
      const rows = res.rows || []
      return rows.map((r: any) => ({
        id: r.id,
        userId: r.userId,
        courseId: r.courseId,
        status: r.status,
        progress: r.progress,
        enrolledAt: r.enrolledAt,
        user: { name: r.userName, email: r.userEmail },
        course: { title: r.courseTitle },
        _meta: { total_lessons: Number(r.total_lessons ?? 0), completed_lessons: Number(r.completed_lessons ?? 0) }
      }))
    } catch (e) {
      console.warn('pg getRecentEnrollments failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(
      `SELECT e.id, e.userId, e.courseId, e.status, e.progress, e.enrolledAt,
              u.name as userName, u.email as userEmail,
              c.title as courseTitle
       FROM "Enrollment" e
       LEFT JOIN "users" u ON u.id = e.userId
       LEFT JOIN "Course" c ON c.id = e.courseId
       ORDER BY e.enrolledAt DESC
       LIMIT ?`
    ).all(limit) as any[]
    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      courseId: r.courseId,
      status: r.status,
      progress: r.progress,
      enrolledAt: r.enrolledAt,
      user: { name: r.userName, email: r.userEmail },
      course: { title: r.courseTitle },
      _meta: { total_lessons: 0, completed_lessons: 0 }
    }))
  } catch (e) { return [] }
}

export async function getAllCoursesWithCounts() {
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT c.*, COALESCE(ec.enroll_count,0) AS enrollmentsCount, COALESCE(mc.module_count,0) AS modulesCount
         FROM "Course" c
         LEFT JOIN (SELECT "courseId", COUNT(1) AS enroll_count FROM "Enrollment" GROUP BY "courseId") ec ON ec."courseId" = c.id
         LEFT JOIN (SELECT "courseId", COUNT(1) AS module_count FROM "Module" GROUP BY "courseId") mc ON mc."courseId" = c.id
         ORDER BY c."createdAt" DESC`
      )
      const rows = res.rows || []
      return rows.map((r: any) => ({ ...r, _count: { enrollments: Number(r.enrollmentsCount ?? 0), modules: Number(r.modulesCount ?? 0) } }))
    } catch (e) {
      console.warn('pg getAllCoursesWithCounts failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(
      `SELECT c.*, COALESCE(ec.enroll_count,0) AS enrollmentsCount, COALESCE(mc.module_count,0) AS modulesCount
       FROM "Course" c
       LEFT JOIN (SELECT courseId, COUNT(1) AS enroll_count FROM "Enrollment" GROUP BY courseId) ec ON ec.courseId = c.id
       LEFT JOIN (SELECT courseId, COUNT(1) AS module_count FROM "Module" GROUP BY courseId) mc ON mc.courseId = c.id
       ORDER BY c.createdAt DESC`
    ).all() as any[]
    return rows.map(r => ({ ...r, _count: { enrollments: r.enrollmentsCount ?? 0, modules: r.modulesCount ?? 0 } }))
  } catch (e) { return [] }
}

export async function getPendingApplications() {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone FROM "applications" a LEFT JOIN "users" u ON u.id = a."userId" WHERE a.status = 'pending' ORDER BY a."submittedAt" DESC`)
      return (res.rows || []).map((a: any) => ({ ...a, user: { name: a.userName, email: a.userEmail, phone: a.userPhone } }))
    } catch (e) { console.warn('pg getPendingApplications failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone FROM "applications" a LEFT JOIN "users" u ON u.id = a.userId WHERE a.status = 'pending' ORDER BY a.submittedAt DESC`).all() as any[]
    return rows.map(a => ({ ...a, user: { name: a.userName, email: a.userEmail, phone: a.userPhone } }))
  } catch (e) { return [] }
}

export async function getAllApplications() {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone FROM "applications" a LEFT JOIN "users" u ON u.id = a."userId" ORDER BY a."submittedAt" DESC`)
      return (res.rows || []).map((a: any) => ({ ...a, user: { name: a.userName, email: a.userEmail, phone: a.userPhone } }))
    } catch (e) { console.warn('pg getAllApplications failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone FROM "applications" a LEFT JOIN "users" u ON u.id = a.userId ORDER BY a.submittedAt DESC`).all() as any[]
    return rows.map(a => ({ ...a, user: { name: a.userName, email: a.userEmail, phone: a.userPhone } }))
  } catch (e) { return [] }
}

export async function createApplication(args: { userId: string; program: string; experience: string; motivation: string; commitment?: boolean; notes?: string }) {
  const id = genId()
  const now = new Date().toISOString()
  if (pgPool) {
    try {
      const res = await pgPool.query(`INSERT INTO "applications" (id, "userId", program, status, experience, motivation, commitment, "submittedAt", notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`, [id, args.userId, args.program, 'pending', args.experience, args.motivation, args.commitment ? 1 : 0, now, args.notes ?? null])
      return (res.rows && res.rows[0]) ?? null
    } catch (e) { console.warn('pg createApplication failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    sqlite.prepare(`INSERT INTO "applications" (id, userId, program, status, experience, motivation, commitment, submittedAt, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, args.userId, args.program, 'pending', args.experience, args.motivation, args.commitment ? 1 : 0, now, args.notes ?? null)
    return sqlite.prepare('SELECT * FROM "applications" WHERE id = ?').get(id)
  } catch (e) { return null }
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
  const allowed = ['pending', 'shortlisted', 'accepted', 'activated', 'rejected']
  if (!allowed.includes(status)) return false
  if (pgPool) {
    try {
      if (notes !== undefined) {
        await pgPool.query(`UPDATE "applications" SET status = $1, notes = $2 WHERE id = $3`, [status, notes, id])
      } else {
        await pgPool.query(`UPDATE "applications" SET status = $1 WHERE id = $2`, [status, id])
      }
      return true
    } catch (e) { console.warn('pg updateApplicationStatus failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    if (notes !== undefined) {
      sqlite.prepare('UPDATE "applications" SET status = ?, notes = ? WHERE id = ?').run(status, notes, id)
    } else {
      sqlite.prepare('UPDATE "applications" SET status = ? WHERE id = ?').run(status, id)
    }
    return true
  } catch (e) { return false }
}

export async function getApplicationById(id: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM "applications" WHERE id = $1 LIMIT 1', [id])
      return (res.rows && res.rows[0]) ?? null
    } catch (e) { console.warn('pg getApplicationById failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    return sqlite.prepare('SELECT * FROM "applications" WHERE id = ?').get(id) ?? null
  } catch (e) { return null }
}

export async function updateUserPasswordAndRole(userId: string, passwordHash: string | null, role: string) {
  const now = new Date().toISOString()
  if (pgPool) {
    try {
      if (passwordHash !== null) {
        await pgPool.query('UPDATE "users" SET password = $1, role = $2, "updatedAt" = $3 WHERE id = $4', [passwordHash, role, now, userId])
      } else {
        await pgPool.query('UPDATE "users" SET role = $1, "updatedAt" = $2 WHERE id = $3', [role, now, userId])
      }
      return true
    } catch (e) { console.warn('pg updateUserPasswordAndRole failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    if (passwordHash !== null) {
      sqlite.prepare('UPDATE "users" SET password = ?, role = ?, updatedAt = ? WHERE id = ?').run(passwordHash, role, now, userId)
    } else {
      sqlite.prepare('UPDATE "users" SET role = ?, updatedAt = ? WHERE id = ?').run(role, now, userId)
    }
    return true
  } catch (e) { return false }
}

export async function getStudentsWithEnrollment() {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT u.id, u.name, u.email, u.phone, u.role, u."createdAt", e."courseId", e."enrolledAt" as enrollmentDate, e.status as enrollmentStatus, c.title as courseTitle FROM "users" u LEFT JOIN "Enrollment" e ON e."userId" = u.id LEFT JOIN "Course" c ON c.id = e."courseId" WHERE u.role != 'ADMIN' AND u.password != '__applicant__' ORDER BY u."createdAt" DESC`)
      return res.rows || []
    } catch (e) { console.warn('pg getStudentsWithEnrollment failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT u.id, u.name, u.email, u.phone, u.role, u.createdAt, e.courseId, e.enrolledAt as enrollmentDate, e.status as enrollmentStatus, c.title as courseTitle FROM "users" u LEFT JOIN "Enrollment" e ON e.userId = u.id LEFT JOIN "Course" c ON c.id = e.courseId WHERE u.role != 'ADMIN' AND u.password != '__applicant__' ORDER BY u.createdAt DESC`).all() as any[]
    return rows
  } catch (e) { return [] }
}

export async function getEnrollmentsForUser(userId: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query(`SELECT e.*, c.title as courseTitle FROM "Enrollment" e LEFT JOIN "Course" c ON c.id = e."courseId" WHERE e."userId" = $1 ORDER BY e."enrolledAt" DESC`, [userId])
      return res.rows || []
    } catch (e) { console.warn('pg getEnrollmentsForUser failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT e.id as enrollmentId, e.courseId, e.progress as progress, e.enrolledAt, c.title as courseTitle FROM "Enrollment" e LEFT JOIN "Course" c ON c.id = e.courseId WHERE e.userId = ?`).all(userId) as any[]
    return rows
  } catch (e) { return [] }
}

export async function getLessonsForCourseWithProgress(userId: string, courseId: string) {
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT l.id, l.title, COALESCE(p.completed,0) as completed
         FROM "Lesson" l
         JOIN "Module" m ON m.id = l."moduleId"
         LEFT JOIN "Progress" p ON p."lessonId" = l.id AND p."userId" = $1
         WHERE m."courseId" = $2
         ORDER BY l."createdAt" ASC`,
        [userId, courseId]
      )
      return res.rows || []
    } catch (e) { console.warn('pg getLessonsForCourseWithProgress failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return []
  try {
    const rows = sqlite.prepare(`SELECT l.id, l.title, COALESCE(p.completed,0) as completed FROM "Lesson" l JOIN "Module" m ON m.id = l.moduleId LEFT JOIN "Progress" p ON p.lessonId = l.id AND p.userId = ? WHERE m.courseId = ? ORDER BY l.createdAt ASC`).all(userId, courseId) as any[]
    return rows
  } catch (e) { return [] }
}

export async function revokeStudent(userId: string) {
  if (pgPool) {
    try {
      await pgPool.query('UPDATE "users" SET role = $1 WHERE id = $2', ['REVOKED', userId])
      await pgPool.query('UPDATE "Enrollment" SET status = $1 WHERE "userId" = $2 AND status = $3', ['revoked', userId, 'active'])
      return true
    } catch (e) { console.warn('pg revokeStudent failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    sqlite.prepare('UPDATE "users" SET role = ? WHERE id = ?').run('REVOKED', userId)
    sqlite.prepare('UPDATE "Enrollment" SET status = ? WHERE userId = ? AND status = ?').run('revoked', userId, 'active')
    return true
  } catch (e) { return false }
}

export async function restoreStudent(userId: string) {
  if (pgPool) {
    try {
      await pgPool.query('UPDATE "users" SET role = $1 WHERE id = $2', ['STUDENT', userId])
      await pgPool.query('UPDATE "Enrollment" SET status = $1 WHERE "userId" = $2 AND status = $3', ['active', userId, 'revoked'])
      return true
    } catch (e) { console.warn('pg restoreStudent failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    sqlite.prepare('UPDATE "users" SET role = ? WHERE id = ?').run('STUDENT', userId)
    sqlite.prepare('UPDATE "Enrollment" SET status = ? WHERE userId = ? AND status = ?').run('active', userId, 'revoked')
    return true
  } catch (e) { return false }
}

export async function deleteUserAndData(userId: string) {
  if (pgPool) {
    try {
      await pgPool.query('BEGIN')
      await pgPool.query('DELETE FROM "Progress" WHERE "userId" = $1', [userId])
      await pgPool.query('DELETE FROM "Payment" WHERE "userId" = $1', [userId])
      await pgPool.query('DELETE FROM "Enrollment" WHERE "userId" = $1', [userId])
      await pgPool.query('DELETE FROM "applications" WHERE "userId" = $1', [userId])
      await pgPool.query('DELETE FROM "users" WHERE id = $1', [userId])
      await pgPool.query('COMMIT')
      return true
    } catch (e) { try { await pgPool.query('ROLLBACK') } catch (_) {} console.warn('pg deleteUserAndData failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    const tx = sqlite.transaction(() => {
      sqlite.prepare('DELETE FROM "Progress" WHERE userId = ?').run(userId)
      sqlite.prepare('DELETE FROM "Payment" WHERE userId = ?').run(userId)
      sqlite.prepare('DELETE FROM "Enrollment" WHERE userId = ?').run(userId)
      sqlite.prepare('DELETE FROM "applications" WHERE userId = ?').run(userId)
      sqlite.prepare('DELETE FROM "users" WHERE id = ?').run(userId)
    })
    tx()
    return true
  } catch (e) { return false }
}

export async function deleteModuleById(moduleId: string) {
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM "Lesson" WHERE "moduleId" = $1', [moduleId])
      await pgPool.query('DELETE FROM "Module" WHERE id = $1', [moduleId])
      try { await pgPool.query('DELETE FROM lessons WHERE moduleId = $1', [moduleId]) } catch (e) {}
      try { await pgPool.query('DELETE FROM modules WHERE id = $1', [moduleId]) } catch (e) {}
      return true
    } catch (e) { console.warn('pg deleteModuleById failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    sqlite.prepare('DELETE FROM "Lesson" WHERE moduleId = ?').run(moduleId)
    sqlite.prepare('DELETE FROM "Module" WHERE id = ?').run(moduleId)
    try { sqlite.prepare('DELETE FROM "modules" WHERE id = ?').run(moduleId) } catch (e) {}
    try { sqlite.prepare('DELETE FROM "lessons" WHERE moduleId = ?').run(moduleId) } catch (e) {}
    return true
  } catch (e) { return false }
}

export async function updateLessonById(lessonId: string, moduleId: string, data: { title: string; content?: string; videoUrl?: string; duration?: string | number }) {
  const now = new Date().toISOString()
  if (pgPool) {
    try {
      await pgPool.query('UPDATE "Lesson" SET title = $1, content = $2, "videoUrl" = $3, duration = $4, "updatedAt" = $5 WHERE id = $6 AND "moduleId" = $7', [data.title, data.content ?? null, data.videoUrl ?? null, data.duration ?? null, now, lessonId, moduleId])
      const res = await pgPool.query('SELECT * FROM "Lesson" WHERE id = $1', [lessonId])
      return (res.rows && res.rows[0]) ?? null
    } catch (e) { console.warn('pg updateLessonById failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    sqlite.prepare('UPDATE "Lesson" SET title = ?, content = ?, videoUrl = ?, duration = ?, updatedAt = ? WHERE id = ? AND moduleId = ?').run(data.title, data.content ?? null, data.videoUrl ?? null, data.duration ?? null, now, lessonId, moduleId)
    try { sqlite.prepare('UPDATE "lessons" SET title = ?, content = ?, videoUrl = ?, duration = ?, updatedAt = ? WHERE id = ? AND moduleId = ?').run(data.title, data.content ?? null, data.videoUrl ?? null, data.duration ?? null, now, lessonId, moduleId) } catch (e) {}
    return sqlite.prepare('SELECT * FROM "Lesson" WHERE id = ?').get(lessonId)
  } catch (e) { return null }
}

export async function deleteLessonById(lessonId: string, moduleId: string) {
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM "Lesson" WHERE id = $1 AND "moduleId" = $2', [lessonId, moduleId])
      try { await pgPool.query('DELETE FROM lessons WHERE id = $1 AND moduleId = $2', [lessonId, moduleId]) } catch (e) {}
      return true
    } catch (e) { console.warn('pg deleteLessonById failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return false
  try {
    sqlite.prepare('DELETE FROM "Lesson" WHERE id = ? AND moduleId = ?').run(lessonId, moduleId)
    try { sqlite.prepare('DELETE FROM "lessons" WHERE id = ? AND moduleId = ?').run(lessonId, moduleId) } catch (e) {}
    return true
  } catch (e) { return false }
}

export async function updateCourse(courseId: string, data: Record<string, any>) {
  const fields: string[] = []
  const values: any[] = []
  const allowed = ['title','description','price','duration','level','category','thumbnail','isPublished']
  for (const k of allowed) {
    if (data[k] !== undefined) {
      if (k === 'isPublished') values.push((data[k] === true || data[k] === 1) ? 1 : 0)
      else if (k === 'price') values.push(Number(data[k] ?? 0))
      else if (k === 'duration') values.push(String(data[k] ?? ''))
      else values.push(data[k])
      fields.push(k)
    }
  }
  if (!fields.length) return null
  const now = new Date().toISOString()

  if (pgPool) {
    try {
      const setParts: string[] = []
      let idx = 1
      for (const f of fields) {
        setParts.push(`"${f}" = $${idx++}`)
      }
      setParts.push(`"updatedAt" = $${idx++}`)
      values.push(now)
      // append id param
      values.push(courseId)
      const idParam = `$${values.length}`
      const sql = `UPDATE "Course" SET ${setParts.join(', ')} WHERE id = ${idParam} RETURNING *`
      const res = await pgPool.query(sql, values)
      // try lowercase compatibility
      try {
        const sqlLower = `UPDATE courses SET ${setParts.map(s=>s.replace(/"/g,'')).join(', ')} WHERE id = ${idParam}`
        await pgPool.query(sqlLower, values)
      } catch (e) {}
      return (res.rows && res.rows[0]) ?? null
    } catch (e) {
      console.warn('pg updateCourse failed, falling back to sqlite:', e)
    }
  }

  if (!sqlite) return null
  try {
    const setParts: string[] = []
    const vals: any[] = []
    for (const f of fields) {
      setParts.push(`"${f}" = ?`)
      vals.push(data[f] === undefined ? null : (f === 'price' ? Number(data[f] ?? 0) : (f === 'duration' ? String(data[f] ?? '') : data[f])))
    }
    setParts.push('"updatedAt" = ?')
    vals.push(now)
    vals.push(courseId)
    const sql = `UPDATE "Course" SET ${setParts.join(', ')} WHERE id = ?`
    sqlite.prepare(sql).run(...vals)
    try {
      const sqlLower = `UPDATE courses SET ${setParts.map(s=>s.replace(/"/g,'')).join(', ')} WHERE id = ?`
      sqlite.prepare(sqlLower).run(...vals)
    } catch (e) {}
    return sqlite.prepare('SELECT * FROM "Course" WHERE id = ?').get(courseId)
  } catch (e) { return null }
}

export async function deleteCourse(courseId: string) {
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM "Course" WHERE id = $1', [courseId])
      try { await pgPool.query('DELETE FROM courses WHERE id = $1', [courseId]) } catch (e) {}
      return true
    } catch (e) {
      console.warn('pg deleteCourse failed, falling back to sqlite:', e)
    }
  }
  if (!sqlite) return false
  try {
    sqlite.prepare('DELETE FROM "Course" WHERE id = ?').run(courseId)
    try { sqlite.prepare('DELETE FROM courses WHERE id = ?').run(courseId) } catch (e) {}
    return true
  } catch (e) { return false }
}

export async function createPayment(data: { id: string; userId: string; courseId?: string | null; program?: string; amount: number; currency: string; status: string; provider?: string | null; providerId?: string | null; createdAt?: string }) {
  const now = data.createdAt ?? new Date().toISOString()
  if (pgPool) {
    try {
      const res = await pgPool.query('INSERT INTO "Payment"(id, "userId", "courseId", program, amount, currency, status, provider, "providerId", "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [data.id, data.userId, data.courseId ?? null, data.program ?? null, data.amount, data.currency, data.status, data.provider ?? null, data.providerId ?? null, now])
      try { await pgPool.query('INSERT INTO payments(id, userId, courseId, program, amount, currency, status, provider, providerId, createdAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING', [data.id, data.userId, data.courseId ?? null, data.program ?? null, data.amount, data.currency, data.status, data.provider ?? null, data.providerId ?? null, now]) } catch (e) {}
      return (res.rows && res.rows[0]) ?? null
    } catch (e) { console.warn('pg createPayment failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    const cols = ['id','userId','courseId','program','amount','currency','status','provider','providerId','createdAt']
    const vals = [data.id, data.userId, data.courseId ?? null, data.program ?? null, data.amount, data.currency, data.status, data.provider ?? null, data.providerId ?? null, now]
    const placeholders = vals.map(()=>'?').join(',')
    sqlite.prepare(`INSERT INTO "Payment"(${cols.map(c=>`"${c}"`).join(',')}) VALUES (${placeholders})`).run(...vals)
    try { sqlite.prepare('INSERT INTO "payments"(id, userId, courseId, program, amount, currency, status, provider, providerId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...vals) } catch (e) {}
    return sqlite.prepare('SELECT * FROM "Payment" WHERE id = ?').get(data.id)
  } catch (e) { return null }
}

export async function upsertProgress(args: { userId: string; lessonId: string; completed: boolean; watchTime?: number }) {
  const now = new Date().toISOString()
  const id = genId()
  if (pgPool) {
    try {
      await pgPool.query('INSERT INTO "Progress"(id, "userId", "lessonId", completed, "watchTime", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT ("userId","lessonId") DO UPDATE SET completed = EXCLUDED.completed, "watchTime" = EXCLUDED."watchTime", "updatedAt" = EXCLUDED."updatedAt"', [id, args.userId, args.lessonId, args.completed ? 1 : 0, Number(args.watchTime ?? 0), now, now])
      try { await pgPool.query('INSERT INTO progress(id, userId, lessonId, completed, watchTime, createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO UPDATE SET completed = EXCLUDED.completed, watchTime = EXCLUDED.watchTime, updatedAt = EXCLUDED.updatedAt', [id, args.userId, args.lessonId, args.completed ? 1 : 0, Number(args.watchTime ?? 0), now, now]) } catch (e) {}
      const res = await pgPool.query('SELECT * FROM "Progress" WHERE "userId" = $1 AND "lessonId" = $2', [args.userId, args.lessonId])
      return (res.rows && res.rows[0]) ?? null
    } catch (e) { console.warn('pg upsertProgress failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    const newid = genId()
    try {
      sqlite.prepare(`INSERT INTO "Progress"(id, userId, lessonId, completed, watchTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(newid, args.userId, args.lessonId, args.completed ? 1 : 0, Number(args.watchTime ?? 0), now, now)
    } catch (e) {
      // try update on conflict
      sqlite.prepare(`UPDATE "Progress" SET completed = ?, watchTime = ?, updatedAt = ? WHERE userId = ? AND lessonId = ?`).run(args.completed ? 1 : 0, Number(args.watchTime ?? 0), now, args.userId, args.lessonId)
    }
    try { sqlite.prepare(`INSERT OR REPLACE INTO "progress"(id, userId, lessonId, completed, watchTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(newid, args.userId, args.lessonId, args.completed ? 1 : 0, Number(args.watchTime ?? 0), now, now) } catch (e) {}
    return sqlite.prepare('SELECT * FROM "Progress" WHERE userId = ? AND lessonId = ?').get(args.userId, args.lessonId)
  } catch (e) { return null }
}

// Module & Lesson write helpers
export async function createModule(courseId: string, data: { title: string; description?: string; order?: number }) {
  const id = genId()
  const now = new Date().toISOString()
  const payload = { id, courseId, title: data.title, description: data.description ?? null, order: Number(data.order ?? 0), position: Number(data.order ?? 0), createdAt: now, updatedAt: now }
  if (pgPool) {
    try {
      const res = await pgPool.query('INSERT INTO "Module"(id, "courseId", title, description, position, createdAt, "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *', [id, courseId, payload.title, payload.description, payload.position, now, now])
      try { await pgPool.query('INSERT INTO modules(id, courseId, title, description, position, createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING', [id, courseId, payload.title, payload.description, payload.position, now, now]) } catch (e) {}
      return (res.rows && res.rows[0]) ?? { ...payload, lessons: [] }
    } catch (e) { console.warn('pg createModule failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    sqlite.prepare('INSERT INTO "Module"(id, courseId, title, description, position, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, courseId, payload.title, payload.description, payload.position, now, now)
    try { sqlite.prepare('INSERT OR IGNORE INTO "modules"(id, courseId, title, description, position, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, courseId, payload.title, payload.description, payload.position, now, now) } catch (e) {}
    const row = sqlite.prepare('SELECT * FROM "Module" WHERE id = ?').get(id)
    return { ...(row || payload), lessons: [] }
  } catch (e) { return null }
}

export async function createLesson(moduleId: string, data: { title: string; description?: string; content?: string; videoUrl?: string; duration?: string | number; order?: number; isFree?: boolean; resources?: string | null }) {
  const id = genId()
  const now = new Date().toISOString()
  const payload: any = { id, moduleId, title: data.title, description: data.description ?? null, content: data.content ?? null, videoUrl: data.videoUrl ?? null, duration: data.duration ?? null, position: Number(data.order ?? 0), order: Number(data.order ?? 0), isFree: data.isFree ? 1 : 0, resources: data.resources ?? null, createdAt: now, updatedAt: now }
  if (pgPool) {
    try {
      const res = await pgPool.query('INSERT INTO "Lesson"(id, "moduleId", title, description, content, "videoUrl", duration, position, "isFree", resources, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *', [id, moduleId, payload.title, payload.description, payload.content, payload.videoUrl, payload.duration, payload.position, payload.isFree, payload.resources, now, now])
      try { await pgPool.query('INSERT INTO lessons(id, moduleId, title, description, content, videoUrl, duration, position, isFree, resources, createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING', [id, moduleId, payload.title, payload.description, payload.content, payload.videoUrl, payload.duration, payload.position, payload.isFree, payload.resources, now, now]) } catch (e) {}
      return (res.rows && res.rows[0]) ?? payload
    } catch (e) { console.warn('pg createLesson failed, falling back to sqlite:', e) }
  }
  if (!sqlite) return null
  try {
    sqlite.prepare('INSERT INTO "Lesson"(id, moduleId, title, description, content, createdAt, updatedAt, videoUrl, duration, position, isFree, resources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, moduleId, payload.title, payload.description, payload.content, now, now, payload.videoUrl, payload.duration, payload.position, payload.isFree, payload.resources)
    try { sqlite.prepare('INSERT OR IGNORE INTO "lessons"(id, moduleId, title, description, content, videoUrl, duration, position, isFree, resources, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, moduleId, payload.title, payload.description, payload.content, payload.videoUrl, payload.duration, payload.position, payload.isFree, payload.resources, now, now) } catch (e) {}
    const row = sqlite.prepare('SELECT * FROM "Lesson" WHERE id = ?').get(id)
    return row || payload
  } catch (e) { return null }
}

export async function createCourse(data: {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string | null;
  price?: number;
  duration?: string | number;
  level?: string;
  category?: string;
  isPublished?: boolean | number;
}) {
  const id = genId()
  const now = new Date().toISOString()
  const isPublished = (data.isPublished === false || data.isPublished === 0) ? 0 : 1

  if (pgPool) {
    try {
      const res = await pgPool.query(
        'INSERT INTO "Course"(id, title, slug, description, thumbnail, price, duration, level, "isPublished", category, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
        [id, data.title, data.slug, data.description ?? '', data.thumbnail ?? null, Number(data.price ?? 0), String(data.duration ?? ''), data.level ?? '', isPublished, data.category ?? '', now, now]
      )
      // attempt lowercase compatibility table as well
      try {
        await pgPool.query(
          'INSERT INTO courses(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING',
          [id, data.title, data.slug, data.description ?? '', data.thumbnail ?? null, Number(data.price ?? 0), String(data.duration ?? ''), data.level ?? '', isPublished, data.category ?? '', now, now]
        )
      } catch (e) {
        // ignore compatibility insert errors
      }
      return (res.rows && res.rows[0]) ?? null
    } catch (e) {
      console.warn('pg createCourse failed, falling back to sqlite:', e)
    }
  }

  if (!sqlite) {
    console.warn('createCourse: sqlite not available, skipping insert')
    return null
  }

  sqlite.prepare(
    `INSERT INTO "Course"(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.slug, data.description ?? '', data.thumbnail ?? null, Number(data.price ?? 0), String(data.duration ?? ''), data.level ?? '', isPublished, data.category ?? '', now, now)

  try {
    sqlite.prepare(
      `INSERT OR IGNORE INTO "courses"(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, data.title, data.slug, data.description ?? '', data.thumbnail ?? null, Number(data.price ?? 0), String(data.duration ?? ''), data.level ?? '', isPublished, data.category ?? '', now, now)
  } catch (e) {}

  return sqlite.prepare('SELECT * FROM "Course" WHERE id = ?').get(id)
}
