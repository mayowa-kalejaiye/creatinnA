import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCourse, getPublishedCoursesWithCounts } from '@/lib/db-adapter';

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

    const course = await createCourse({
      title,
      slug,
      description: storedDescription,
      thumbnail: thumbnail ?? null,
      price: Number(price || 0),
      duration: duration ?? '',
      level: level ?? '',
      category: category ?? '',
      isPublished: isPublished,
    })

    return NextResponse.json(course, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/courses error:', err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? 'Failed to create course' }, { status: 500 });
  }
}

export async function GET() {
  // list published courses
  const rows = await getPublishedCoursesWithCounts()
  // log for diagnostics
  console.log('GET /api/courses ->', rows ? rows.length : rows, 'rows')
  return NextResponse.json(rows)
}
