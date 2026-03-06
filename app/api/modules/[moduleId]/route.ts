import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteModuleById } from '@/lib/db-adapter';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ok = await deleteModuleById(moduleId)
    return NextResponse.json({ success: !!ok });
  } catch (err) {
    console.error('Delete module error', err);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
