import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sqlite } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const enrollmentsRaw = sqlite
    .prepare(`
      SELECT e.*, c.id as courseId, c.title as courseTitle, c.slug as courseSlug,
             c.description as courseDescription, c.thumbnail as courseThumbnail
      FROM "Enrollment" e
      LEFT JOIN "Course" c ON c.id = e.courseId
      WHERE e.userId = ?
      ORDER BY e.enrolledAt DESC
    `)
    .all(userId);

  const enrollments = (Array.isArray(enrollmentsRaw) ? enrollmentsRaw : []).map((e: any) => ({
    ...e,
    course: {
      id: e.courseId,
      title: e.courseTitle,
      slug: e.courseSlug,
      description: e.courseDescription,
      thumbnail: e.courseThumbnail,
    },
  }));

  const certificates: any[] = [];

  return NextResponse.json({ enrollments, certificates });
}
