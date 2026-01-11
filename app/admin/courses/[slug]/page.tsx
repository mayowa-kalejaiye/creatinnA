import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CourseEditorClient from './CourseEditorClient';

export default async function CourseEditorPage({ params }: { params: { slug: string } }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!course) {
    redirect('/admin');
  }

  return <CourseEditorClient course={course} />;
}
