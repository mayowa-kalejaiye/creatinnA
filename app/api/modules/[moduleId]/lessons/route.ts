import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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
    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    // Flexible insert helper using PRAGMA table_info to avoid "no column named" errors
    const getTableColumns = (tableName: string) => {
      try {
        const rows = sqlite.prepare(`PRAGMA table_info("${tableName}")`).all();
        return Array.isArray(rows) ? rows.map((r: any) => r.name) : [];
      } catch (e) {
        return [];
      }
    };

    const insertInto = (tableName: string, data: Record<string, any>) => {
      const cols = getTableColumns(tableName);
      if (!cols || cols.length === 0) throw new Error(`Table ${tableName} does not exist`);
      const pick: string[] = [];
      const vals: any[] = [];
      for (const k of Object.keys(data)) {
        if (cols.includes(k)) {
          pick.push(`"${k}"`);
          vals.push(data[k]);
        }
      }
      if (pick.length === 0) throw new Error('No matching columns to insert');
      const placeholders = vals.map(() => '?').join(', ');
      const sql = `INSERT INTO "${tableName}"(${pick.join(',')}) VALUES (${placeholders})`;
      sqlite.prepare(sql).run(...vals);
    };

    const dataObj: Record<string, any> = {
      id,
      moduleId: moduleId,
      title,
      description: description ?? null,
      content: content ?? null,
      videoUrl: videoUrl ?? null,
      duration: duration ?? null,
      order: Number(order ?? 0),
      position: Number(order ?? 0),
      isFree: isFree ? 1 : 0,
      resources: resources ?? null,
      createdAt: now,
      updatedAt: now,
    };

    let inserted = false;
    const candidates = ['Lesson', 'lessons'];
    for (const t of candidates) {
      try {
        insertInto(t, dataObj);
        inserted = true;
        if (t === 'Lesson') {
          try { insertInto('lessons', dataObj); } catch (e) { /* ignore */ }
        }
        break;
      } catch (e) {
        // try next candidate
      }
    }

    if (!inserted) {
      console.error('Failed to insert lesson into any known table');
      throw new Error('Failed to insert lesson');
    }

    // Fetch inserted lesson
    let lesson: any = null;
    try { lesson = sqlite.prepare('SELECT * FROM "Lesson" WHERE id = ?').get(id); } catch (e) { lesson = null }
    if (!lesson) {
      try { lesson = sqlite.prepare('SELECT * FROM "lessons" WHERE id = ?').get(id); } catch (e) { lesson = null }
    }

    if (!lesson) {
      console.error('Lesson created but could not be retrieved, id=', id);
      return NextResponse.json({ error: 'Lesson created but could not be retrieved' }, { status: 500 });
    }

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
