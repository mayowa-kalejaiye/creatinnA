import { NextRequest, NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete lessons under the module first
    sqlite.prepare('DELETE FROM "Lesson" WHERE moduleId = ?').run(moduleId);
    // Delete the module
    sqlite.prepare('DELETE FROM "Module" WHERE id = ?').run(moduleId);

    // Also try lowercase compatibility
    try { sqlite.prepare('DELETE FROM "modules" WHERE id = ?').run(moduleId); } catch (e) {}
    try { sqlite.prepare('DELETE FROM "lessons" WHERE moduleId = ?').run(moduleId); } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete module error', err);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
