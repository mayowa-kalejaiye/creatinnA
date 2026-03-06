import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createLesson } from '@/lib/db-adapter';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const { moduleId } = await params;
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, content, videoUrl, duration, order, isFree, resources } = await req.json();
    const lesson = await createLesson(moduleId, { title, description, content, videoUrl, duration, order, isFree, resources })
    if (!lesson) return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
