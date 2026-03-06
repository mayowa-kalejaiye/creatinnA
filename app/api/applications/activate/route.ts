import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getApplicationById, getUserById, getCourseBySlug, createEnrollment, updateUserPasswordAndRole, updateApplicationStatus } from "@/lib/db-adapter";

/**
 * POST /api/applications/activate
 *
 * Called by admin after offline payment is confirmed.
 * - Activates the user account (generates password if first time)
 * - Enrolls the user in the course they applied for
 *
 * Body: { applicationId: string }
 * Returns: { email, password?, alreadyActive, courseTitle, enrolled }
 *   password is only returned when a new password was generated (first activation)
 */

// Map application program keys to course slugs
const programToSlug: Record<string, string> = {
  intensive: "2-week-video-editing-intensive",
  mastery: "1-on-1-mastery-track",
  online: "online-video-editing",
};

function generatePassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < length; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId is required" }, { status: 400 });
    }
    // Fetch the application
    const app: any = await getApplicationById(applicationId)
    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    if (app.status !== "accepted") {
      return NextResponse.json(
        { error: "Application must be accepted before activation" },
        { status: 400 }
      );
    }

    // Find the user
    const user: any = await getUserById(app.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine if this is a first-time activation (password is the placeholder)
    const isFirstTime = user.password === "__applicant__";
    let plainPassword: string | null = null;

    if (isFirstTime) {
      plainPassword = generatePassword(10);
      const hashed = await bcrypt.hash(plainPassword, 10);
      await updateUserPasswordAndRole(user.id, hashed, 'STUDENT')
    } else if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      // Ensure activated users have STUDENT role
      await updateUserPasswordAndRole(user.id, null, 'STUDENT')
    }

    // Find the course by slug
    const slug = programToSlug[app.program] ?? app.program;
    const course: any = await getCourseBySlug(slug)
    if (!course) {
      return NextResponse.json(
        { error: `Course not found for program "${app.program}"` },
        { status: 404 }
      );
    }

    // Ensure enrollment exists
    let enrolled = false
    const createdEnrollment = await createEnrollment({ userId: user.id, courseId: course.id })
    if (createdEnrollment) enrolled = true

    // Mark the application as "activated" so admin knows it's done
    await updateApplicationStatus(applicationId, 'activated')

    return NextResponse.json({
      email: user.email,
      password: plainPassword, // null if returning user
      alreadyActive: !isFirstTime,
      courseTitle: course.title,
      courseSlug: course.slug,
      enrolled: enrolled,
      alreadyEnrolled: !enrolled,
    });
  } catch (err: any) {
    console.error("[activate]", err);
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
