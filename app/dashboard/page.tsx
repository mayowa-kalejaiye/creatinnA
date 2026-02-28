import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sqlite } from '@/lib/prisma'
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  type User = { id: string; name?: string; email?: string; role?: string };
  const user = (session && (session as any).user) as User | undefined;
  if (!user) {
    redirect('/login');
    return null;
  }
  // Redirect admin to admin dashboard
  if (user.role === 'ADMIN') {
    redirect('/admin');
    return null;
  }

  // User enrollments with course titles
  const enrollmentsRaw = sqlite
    .prepare(`
      SELECT e.*, c.id as courseId, c.title as courseTitle, c.slug as courseSlug, c.description as courseDescription, c.thumbnail as courseThumbnail
      FROM "Enrollment" e
      LEFT JOIN "Course" c ON c.id = e.courseId
      WHERE e.userId = ?
      ORDER BY e.enrolledAt DESC
    `)
    .all(user.id);

  // Shape enrollments to include a `course` object for the client
  const enrollments = (Array.isArray(enrollmentsRaw) ? enrollmentsRaw : []).map((e: any) => ({
    ...e,
    course: {
      id: e.courseId,
      title: e.courseTitle,
      slug: e.courseSlug,
      description: e.courseDescription,
      thumbnail: e.courseThumbnail,
    }
  }));

  // User progress
  const progress = sqlite
    .prepare('SELECT * FROM "Progress" WHERE userId = ?')
    .all(user.id);

  // Certificates (not implemented yet) — pass empty array for now
  const certificates: any[] = [];

  return (
    <DashboardClient
      user={{ name: user.name ?? '', email: user.email ?? '' }}
      enrollments={enrollments}
      certificates={certificates}
    />
  );
}
