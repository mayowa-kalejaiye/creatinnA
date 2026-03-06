import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEnrollmentByUserCourse, createEnrollment } from "@/lib/db-adapter";

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
    const exists = await getEnrollmentByUserCourse(userId, courseId)
    if (exists) return NextResponse.json({ error: "Already enrolled" }, { status: 400 })

    const enrollment = await createEnrollment({ userId, courseId })
    if (!enrollment) return NextResponse.json({ error: "Failed to enroll" }, { status: 500 })
    return NextResponse.json(enrollment, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
