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
    const { title, description, thumbnail, price, duration, level, category, isPublished } = body;

    // Auto-generate slug from title if not provided
    const slug = body.slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Store description as plain text (no JSON wrapping)
    const storedDescription = description ?? '';

    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    sqlite.prepare(
      `INSERT INTO "Course"(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, slug, storedDescription, thumbnail ?? null, Number(price || 0), duration ?? '', level ?? '', (isPublished === false || isPublished === 0) ? 0 : 1, category ?? '', now, now);

    // also insert into lowercase table for compatibility with other code that expects "courses"
    try {
      sqlite.prepare(
        `INSERT OR IGNORE INTO "courses"(id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(id, title, slug, storedDescription, thumbnail ?? null, Number(price || 0), duration ?? '', level ?? '', (isPublished === false || isPublished === 0) ? 0 : 1, category ?? '', now, now);
    } catch (e) {
      // ignore if table doesn't exist
    }

    const course = sqlite.prepare('SELECT * FROM "Course" WHERE id = ?').get(id);
    return NextResponse.json(course, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/courses error:', err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? 'Failed to create course' }, { status: 500 });
  }
}

export async function GET() {
  // list published courses
  const rows = sqlite.prepare('SELECT * FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC').all();
  return NextResponse.json(rows);
}
