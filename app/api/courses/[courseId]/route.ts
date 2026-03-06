import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateCourse, deleteCourse } from '@/lib/db-adapter';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, price, duration, level, category, thumbnail, isPublished, meta } = data;
    let { description } = data;

    // If meta provided, store plain description (not JSON-wrapped) — meta fields
    // are informational and the description should remain human-readable
    // (The front-end can send meta but we just keep the plain description.)

    // Build dynamic SET clause
    const assignments: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      assignments.push('"title" = ?');
      values.push(title);
    }
    if (description !== undefined) {
      assignments.push('"description" = ?');
      values.push(description);
    }
    if (price !== undefined) {
      assignments.push('"price" = ?');
      values.push(Number(price));
    }
    if (duration !== undefined) {
      assignments.push('"duration" = ?');
      values.push(duration);
    }
    if (level !== undefined) {
      assignments.push('"level" = ?');
      values.push(level);
    }
    if (category !== undefined) {
      assignments.push('"category" = ?');
      values.push(category);
    }
    if (thumbnail !== undefined) {
      assignments.push('"thumbnail" = ?');
      values.push(thumbnail);
    }
    if (isPublished !== undefined) {
      assignments.push('"isPublished" = ?');
      values.push((isPublished === true || isPublished === 1) ? 1 : 0);
    }

    if (assignments.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // always update updatedAt
    assignments.push('"updatedAt" = ?');
    values.push(new Date().toISOString());

    // WHERE id param
    values.push(courseId);

    const updated = await updateCourse(courseId, {
      title, description, price, duration, level, category, thumbnail, isPublished, meta
    })

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ok = await deleteCourse(courseId)
    return NextResponse.json({ success: !!ok });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
