import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId, completed, watchTime } = await req.json();
    const userId = session.user.id;
    const now = new Date().toISOString();

    sqlite
      .prepare(
        `INSERT INTO "Progress"(id, userId, lessonId, completed, watchTime, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(userId, lessonId) DO UPDATE SET completed = excluded.completed, watchTime = excluded.watchTime, updatedAt = excluded.updatedAt`
      )
      .run(
        (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now()),
        userId,
        lessonId,
        completed ? 1 : 0,
        Number(watchTime || 0),
        now,
        now
      );

    const row = sqlite.prepare('SELECT * FROM "Progress" WHERE userId = ? AND lessonId = ?').get(userId, lessonId);
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
