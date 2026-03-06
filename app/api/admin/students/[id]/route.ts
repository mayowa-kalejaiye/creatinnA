import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { revokeStudent, restoreStudent, deleteUserAndData, getUserById } from '@/lib/db-adapter';

// PATCH - Revoke or restore student access
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { action } = body; // 'revoke' or 'restore'

  if (!['revoke', 'restore'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const user = await getUserById(id)
  if (!user) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  if (user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot modify admin accounts' }, { status: 403 });
  }

  if (action === 'revoke') {
    const ok = await revokeStudent(id)
    return NextResponse.json({ success: !!ok, message: 'Student access revoked' })
  }

  if (action === 'restore') {
    const ok = await restoreStudent(id)
    return NextResponse.json({ success: !!ok, message: 'Student access restored' })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

// DELETE - Permanently delete a student and all their data
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Check user exists and is not an admin
  const user2 = await getUserById(id)
  if (!user2) return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  if ((user2 as any).role === 'ADMIN') return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 })
  const ok = await deleteUserAndData(id)
  return NextResponse.json({ success: !!ok, message: ok ? 'Student permanently deleted' : 'Failed to delete student' })
}
