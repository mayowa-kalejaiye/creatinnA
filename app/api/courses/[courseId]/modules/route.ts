import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, order } = await req.json();
    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    // Build a flexible insert based on the actual table columns (avoids "no such column" errors)
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
      courseId: courseId,
      title,
      description: description ?? null,
      order: Number(order ?? 0),
      position: Number(order ?? 0),
      createdAt: now,
      updatedAt: now,
    };

    let inserted = false;
    const candidates = ['Module', 'modules'];
    for (const t of candidates) {
      try {
        insertInto(t, dataObj);
        inserted = true;
        if (t === 'Module') {
          try { insertInto('modules', dataObj); } catch (e) { /* ignore */ }
        }
        break;
      } catch (e) {
        // try next candidate
      }
    }

    if (!inserted) {
      const errMsg = 'Failed to insert module into any known table';
      console.error(errMsg);
      throw new Error(errMsg);
    }

    // Fetch the inserted row from whichever table contains it
    let moduleRow: any = null;
    try { moduleRow = sqlite.prepare('SELECT * FROM "Module" WHERE id = ?').get(id); } catch (e) { moduleRow = null }
    if (!moduleRow) {
      try { moduleRow = sqlite.prepare('SELECT * FROM "modules" WHERE id = ?').get(id); } catch (e) { moduleRow = null }
    }

    if (!moduleRow) {
      console.error('Module insert reported success but row not found, id=', id);
      return NextResponse.json({ error: 'Module created but could not be retrieved' }, { status: 500 });
    }

    moduleRow.lessons = [];
    return NextResponse.json(moduleRow, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}
