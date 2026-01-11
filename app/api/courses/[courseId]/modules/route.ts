import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, order } = await req.json();
    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    sqlite
      .prepare(
        `INSERT INTO "Module"(id, courseId, title, description, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(id, params.courseId, title, description ?? null, Number(order ?? 0), now, now);

    const moduleRow = sqlite.prepare('SELECT * FROM "Module" WHERE id = ?').get(id);
    return NextResponse.json(moduleRow, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}
