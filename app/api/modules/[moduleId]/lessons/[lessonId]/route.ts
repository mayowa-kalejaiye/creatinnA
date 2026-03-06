import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateLessonById, deleteLessonById } from '@/lib/db-adapter';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, videoUrl, duration } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const updated = await updateLessonById(lessonId, moduleId, { title, content, videoUrl, duration })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Update lesson error', err);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ok = await deleteLessonById(lessonId, moduleId)
    return NextResponse.json({ success: !!ok })
  } catch (err) {
    console.error('Delete lesson error', err);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
