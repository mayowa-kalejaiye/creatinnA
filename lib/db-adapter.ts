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
