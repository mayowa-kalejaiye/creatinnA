import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CoursePlayerClient from './CoursePlayerClient';
import { getCourseBySlug, getEnrollmentByUserCourse, getProgressForUserCourse } from '@/lib/db-adapter';
export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?redirect=/course/${slug}`);
    return null;
  }
  const course = await getCourseBySlug(slug) as any;

  // Defensive: ensure course is a plain object with required fields
  if (!course || typeof course !== 'object' || !course.id) {
    redirect('/courses');
    return null;
  }

  // Defensive: ensure enrollment is an object or null
  const enrollment = await getEnrollmentByUserCourse(session.user.id, course.id);

  // Defensive: ensure progress is always an array
  const progressRaw = await getProgressForUserCourse(session.user.id, course.id);
  // Defensive: ensure progress is Progress[]
  type Progress = { id: string; userId: string; lessonId: string; completed: number; watchTime?: number; createdAt?: string; updatedAt?: string };
  const progress: Progress[] = Array.isArray(progressRaw) ? progressRaw as Progress[] : [];

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
