import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, description, thumbnail, price, duration, level, category, isPublished } = body;

    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    sqlite.prepare(
      `INSERT INTO "Course"(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, slug, description, thumbnail ?? null, Number(price || 0), duration ?? '', level ?? '', isPublished ? 1 : 0, category ?? '', now, now);

    const course = sqlite.prepare('SELECT * FROM "Course" WHERE id = ?').get(id);
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function GET() {
  // list published courses
  const rows = sqlite.prepare('SELECT * FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC').all();
  return NextResponse.json(rows);
}
