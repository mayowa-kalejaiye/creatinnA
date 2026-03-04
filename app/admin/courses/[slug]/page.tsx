import { auth } from '@/lib/auth';
import { getCourseBySlug } from '@/lib/db-adapter';
import { redirect } from 'next/navigation';
import CourseEditorClient from './CourseEditorClient';
 

export default async function CourseEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;

  const s: any = session;
  if (!s?.user || s.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin');
  }

  // `params` may be a promise-like in Next.js dynamic routes — await it before use
  const course = await getCourseBySlug(slug);

  if (!course) {
    redirect('/admin');
  }

  return <CourseEditorClient course={course as any} />;
}
