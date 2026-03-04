import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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

    const now = new Date().toISOString();
    sqlite.prepare(
      'UPDATE "Lesson" SET title = ?, content = ?, videoUrl = ?, duration = ?, updatedAt = ? WHERE id = ? AND moduleId = ?'
    ).run(title, content || null, videoUrl || null, duration || null, now, lessonId, moduleId);

    const updated = sqlite.prepare('SELECT * FROM "Lesson" WHERE id = ?').get(lessonId);
    return NextResponse.json(updated);
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

    sqlite.prepare('DELETE FROM "Lesson" WHERE id = ? AND moduleId = ?').run(lessonId, moduleId);
    try { sqlite.prepare('DELETE FROM "lessons" WHERE id = ? AND moduleId = ?').run(lessonId, moduleId); } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete lesson error', err);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
