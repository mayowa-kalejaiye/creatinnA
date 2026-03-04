import { NextRequest, NextResponse } from "next/server";
import { sqlite } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    // ensure not already enrolled
    const exists = sqlite
      .prepare(
        'SELECT 1 FROM "Enrollment" WHERE userId = ? AND courseId = ?'
      )
      .get(userId, courseId);
    if (exists)
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });

    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();
    sqlite
      .prepare(
        `INSERT INTO "Enrollment"(id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, 'active', 0, ?)`
      )
      .run(id, userId, courseId, now);

    const enrollment = sqlite
      .prepare('SELECT * FROM "Enrollment" WHERE id = ?')
      .get(id);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
