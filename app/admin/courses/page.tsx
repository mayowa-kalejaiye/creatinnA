import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { sqlite } from '@/lib/prisma'
// ...existing imports...

export default async function AdminCoursesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/admin/courses')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  let courses: any[] = []
  if (!sqlite) {
    console.warn('AdminCoursesPage: sqlite not available in this environment; returning empty courses list')
    courses = []
  } else {
    courses = sqlite
      .prepare(
        `SELECT c.*,
                COALESCE(ec.enroll_count,0) AS enrollmentsCount,
                COALESCE(mc.module_count,0) AS modulesCount
         FROM "Course" c
         LEFT JOIN (SELECT courseId, COUNT(1) AS enroll_count FROM "Enrollment" GROUP BY courseId) ec ON ec.courseId = c.id
         LEFT JOIN (SELECT courseId, COUNT(1) AS module_count FROM "Module" GROUP BY courseId) mc ON mc.courseId = c.id
         ORDER BY c.createdAt DESC`
      )
      .all()
  }

  // ...existing UI that renders courses for admin ...
  return (
    <div>
      {/* Admin courses list UI — use `courses` */}
    </div>
  )
}
