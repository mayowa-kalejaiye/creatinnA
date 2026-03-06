import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createModule } from '@/lib/db-adapter';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
      const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, order } = await req.json();
    const moduleRow = await createModule(courseId, { title, description, order })
    if (!moduleRow) return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
    return NextResponse.json({ ...moduleRow, lessons: moduleRow.lessons ?? [] }, { status: 201 })
  } catch (err) {
    console.error('Create module error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
