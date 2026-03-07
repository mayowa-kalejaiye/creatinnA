import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getEnrollmentsForUser, getLessonsForCourseWithProgress } from '@/lib/db-adapter';

export default async function DashboardPage() {
  const session = await auth();
  type User = { id: string; name?: string; email?: string; role?: string };
  const user = (session && (session as any).user) as User | undefined;
  if (!user) {
    redirect('/login');
    return null;
  }

  const enrollmentsRaw = await getEnrollmentsForUser(user.id)
  const enrollments: any[] = []
  for (const e of enrollmentsRaw) {
    const lessons = await getLessonsForCourseWithProgress(user.id, e.courseId)
    const total = Array.isArray(lessons) ? lessons.length : 0
    const completed = Array.isArray(lessons) ? lessons.filter((l:any)=>Number(l.completed)===1).length : 0
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    enrollments.push({
      ...e,
      course: {
        id: e.courseId,
        title: e.courseTitle || e.title,
        slug: e.courseSlug || e.slug || '',
        description: e.courseDescription || e.description,
        thumbnail: e.courseThumbnail || e.thumbnail,
      },
      progress,
    })
  }

  // User progress
  // user progress can be derived from lessons/progress lookups as needed; leave empty here
  const progress: any[] = []

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
