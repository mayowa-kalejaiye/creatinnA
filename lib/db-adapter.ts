import { sqlite } from "./prisma"

// NOTE: table names follow your existing SQL migrations (quoted where needed)

function genId() {
  return (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now())
}

export async function getUserByEmail(email: string) {
  const stmt = sqlite.prepare('SELECT * FROM "users" WHERE email = ?')
  const row = stmt.get(email)
  return row ?? null
}

export async function getUserById(id: string) {
  const stmt = sqlite.prepare('SELECT * FROM "users" WHERE id = ?')
  return stmt.get(id) ?? null
}

export async function createUser(data: { name: string; email: string; password: string; phone?: string }) {
  const id = genId()
  const now = new Date().toISOString()
  sqlite.prepare(
    `INSERT INTO "users"(id, name, email, password, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.name, data.email, data.password, data.phone ?? null, now, now)
  return getUserById(id)
}

export async function getCourseBySlug(slug: string) {
  const stmt = sqlite.prepare('SELECT * FROM "Course" WHERE slug = ?')
  return stmt.get(slug) ?? null
}

export async function createEnrollment(args: { userId: string; courseId: string }) {
  const id = genId()
  const now = new Date().toISOString()
  sqlite.prepare(
    `INSERT INTO "Enrollment"(id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, 'active', 0, ?)`
  ).run(id, args.userId, args.courseId, now)
  return sqlite.prepare('SELECT * FROM "Enrollment" WHERE id = ?').get(id)
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number) {
  const now = new Date().toISOString()
  sqlite.prepare(
    `UPDATE "Enrollment" SET progress = ?, updatedAt = ? WHERE id = ?`
  ).run(progress, now, enrollmentId)
  return sqlite.prepare('SELECT * FROM "Enrollment" WHERE id = ?').get(enrollmentId)
}
