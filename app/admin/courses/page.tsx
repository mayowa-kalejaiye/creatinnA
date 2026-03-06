import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllCoursesWithCounts } from '@/lib/db-adapter'
// ...existing imports...

export default async function AdminCoursesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/admin/courses')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const courses = await getAllCoursesWithCounts()

  // ...existing UI that renders courses for admin ...
  return (
    <div>
      {/* Admin courses list UI — use `courses` */}
    </div>
  )
}
