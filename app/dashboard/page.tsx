import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sqlite } from '@/lib/prisma'
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Redirect admin to admin dashboard
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  // User enrollments with course titles
  const enrollments = sqlite
    .prepare(`
      SELECT e.*, c.title as courseTitle
      FROM "Enrollment" e
      LEFT JOIN "Course" c ON c.id = e.courseId
      WHERE e.userId = ?
      ORDER BY e.enrolledAt DESC
    `)
    .all(session.user.id);

  // User progress
  const progress = sqlite
    .prepare('SELECT * FROM "Progress" WHERE userId = ?')
    .all(session.user.id);

  return (
    <div>
      {/* dashboard UI renders using enrollments and progress */}
    </div>
  );
}
