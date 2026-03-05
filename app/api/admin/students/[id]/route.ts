import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sqlite } from '@/lib/prisma';

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

  if (!sqlite) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
  const db = sqlite

  // Check user exists and is a student (or revoked)
  const user = db.prepare('SELECT id, role FROM "users" WHERE id = ?').get(id) as any;
  if (!user) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  if (user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot modify admin accounts' }, { status: 403 });
  }

  if (action === 'revoke') {
    db.prepare('UPDATE "users" SET role = ? WHERE id = ?').run('REVOKED', id);
    // Suspend all active enrollments
    db.prepare('UPDATE "Enrollment" SET status = ? WHERE userId = ? AND status = ?').run('revoked', id, 'active');
    return NextResponse.json({ success: true, message: 'Student access revoked' });
  }

  if (action === 'restore') {
    db.prepare('UPDATE "users" SET role = ? WHERE id = ?').run('STUDENT', id);
    // Restore enrollments
    db.prepare('UPDATE "Enrollment" SET status = ? WHERE userId = ? AND status = ?').run('active', id, 'revoked');
    return NextResponse.json({ success: true, message: 'Student access restored' });
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
  if (!sqlite) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
  const db = sqlite

  const user = db.prepare('SELECT id, role FROM "users" WHERE id = ?').get(id) as any;
  if (!user) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  if (user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 });
  }

  // Delete all related data in a transaction
  const deleteAll = db.transaction(() => {
    db.prepare('DELETE FROM "Progress" WHERE userId = ?').run(id);
    db.prepare('DELETE FROM "Payment" WHERE userId = ?').run(id);
    db.prepare('DELETE FROM "Enrollment" WHERE userId = ?').run(id);
    db.prepare('DELETE FROM "applications" WHERE userId = ?').run(id);
    db.prepare('DELETE FROM "users" WHERE id = ?').run(id);
  });

  deleteAll();

  return NextResponse.json({ success: true, message: 'Student permanently deleted' });
}
