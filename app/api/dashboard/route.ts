import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEnrollmentsForUser } from '@/lib/db-adapter';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const enrollmentsRaw = await getEnrollmentsForUser(userId as string)
  const enrollments = (Array.isArray(enrollmentsRaw) ? enrollmentsRaw : []).map((e: any) => ({
    ...e,
    course: {
      id: e.courseId,
      title: e.courseTitle || e.title,
      slug: e.slug,
      description: e.courseDescription || e.description,
      thumbnail: e.courseThumbnail || e.thumbnail,
    },
  }))

  const certificates: any[] = [];

  return NextResponse.json({ enrollments, certificates });
}
