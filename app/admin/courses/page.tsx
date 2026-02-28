import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { sqlite } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
// ...existing imports...

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const courses = sqlite
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

  // ...existing UI that renders courses for admin ...
  return (
    <div>
      {/* Admin courses list UI — use `courses` */}
    </div>
  )
}
