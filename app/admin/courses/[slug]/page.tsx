import { authOptions } from '@/lib/auth';
import { getCourseBySlug } from '@/lib/db-adapter';
import { redirect } from 'next/navigation';
import CourseEditorClient from './CourseEditorClient';
import { getServerSession } from 'next-auth';

export default async function CourseEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  // `params` may be a promise-like in Next.js dynamic routes — await it before use
  const course = await getCourseBySlug(slug);

  if (!course) {
    redirect('/admin');
  }

  return <CourseEditorClient course={course as any} />;
}
