import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { upsertProgress } from '@/lib/db-adapter';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId, completed, watchTime } = await req.json();
    const userId = session.user.id;
    const now = new Date().toISOString();

    const row = await upsertProgress({ userId, lessonId, completed: !!completed, watchTime: Number(watchTime || 0) })
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
