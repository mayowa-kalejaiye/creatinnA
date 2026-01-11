import { auth } from '@/lib/auth';
import { sqlite } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CoursePlayerClient from './CoursePlayerClient';
import { getCourseBySlug } from '@/lib/db-adapter';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?redirect=/course/${params.slug}`);
    return null;
  }

  const course = await getCourseBySlug(params.slug);

  // Defensive: ensure course is a plain object with required fields
  if (!course || typeof course !== 'object' || !course.id) {
    redirect('/courses');
    return null;
  }

  // Defensive: ensure enrollment is an object or null
  const enrollmentStmt = sqlite.prepare('SELECT * FROM "Enrollment" WHERE userId = ? AND courseId = ?');
  const enrollment = enrollmentStmt.get(session.user.id, course.id) ?? null;

  // Defensive: ensure progress is always an array
  const progressStmt = sqlite.prepare(`
    SELECT p.* 
    FROM "Progress" p
    JOIN "Lesson" l ON l.id = p.lessonId
    JOIN "Module" m ON m.id = l.moduleId
    WHERE p.userId = ? AND m.courseId = ?
  `);
  const progressRaw = progressStmt.all(session.user.id, course.id);
  const progress = Array.isArray(progressRaw) ? progressRaw : [];

  // Optionally, normalize progress objects if CoursePlayerClient expects specific fields
  // const normalizedProgress = progress.map(p => ({
  //   ...p,
  //   completed: !!p.completed,
  //   watchTime: Number(p.watchTime ?? 0),
  // }));

  return (
    <CoursePlayerClient
      course={course}
      isEnrolled={!!enrollment}
      progress={progress}
    />
  );
}
