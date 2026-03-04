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

  // Compute accurate progress percentages for each enrollment from the Progress table
  for (const en of enrollments) {
    try {
      const totalRow = sqlite.prepare(
        `SELECT COUNT(l.id) as cnt FROM "Lesson" l JOIN "Module" m ON m.id = l.moduleId WHERE m.courseId = ?`
      ).get(en.courseId) as any;
      const total = totalRow?.cnt ?? 0;
      if (total === 0) {
        en.progress = 0;
        continue;
      }
      const completedRow = sqlite.prepare(
        `SELECT COUNT(p.id) as cnt FROM "Progress" p JOIN "Lesson" l ON l.id = p.lessonId JOIN "Module" m ON m.id = l.moduleId WHERE p.userId = ? AND m.courseId = ? AND p.completed = 1`
      ).get(user.id, en.courseId) as any;
      const completed = completedRow?.cnt ?? 0;
      en.progress = Math.round((completed / total) * 100);
    } catch (e) {
      en.progress = en.progress ?? 0;
    }
  }

  // User progress
  const progress = sqlite
    .prepare('SELECT * FROM "Progress" WHERE userId = ?')
    .all(user.id);

  // Certificates (not implemented yet) — pass empty array for now
  const certificates: any[] = [];

  return (
    <DashboardClient
      user={{ name: user.name ?? '', email: user.email ?? '', role: user.role ?? 'STUDENT' }}
      enrollments={enrollments}
      certificates={certificates}
    />
  );
}
