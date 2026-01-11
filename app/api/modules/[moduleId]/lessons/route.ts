import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, videoUrl, duration, order, isFree, resources } = await req.json();
    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    sqlite
      .prepare(
        `INSERT INTO "Lesson"(id, moduleId, title, description, videoUrl, duration, "order", isFree, resources, createdAt, updatedAt)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        id,
        params.moduleId,
        title,
        description ?? null,
        videoUrl ?? null,
        duration ?? null,
        Number(order ?? 0),
        isFree ? 1 : 0,
        resources ?? null,
        now,
        now
      );

    const lesson = sqlite.prepare('SELECT * FROM "Lesson" WHERE id = ?').get(id);
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
