import { NextResponse } from "next/server";
import { sqlite } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
    const app: any = sqlite
      .prepare('SELECT * FROM "applications" WHERE id = ?')
      .get(applicationId);
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
    const user: any = sqlite
      .prepare('SELECT * FROM "users" WHERE id = ?')
      .get(app.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine if this is a first-time activation (password is the placeholder)
    const isFirstTime = user.password === "__applicant__";
    let plainPassword: string | null = null;

    if (isFirstTime) {
      plainPassword = generatePassword(10);
      const hashed = await bcrypt.hash(plainPassword, 10);
      sqlite
        .prepare('UPDATE "users" SET password = ?, role = ?, updatedAt = ? WHERE id = ?')
        .run(hashed, 'STUDENT', new Date().toISOString(), user.id);
    } else if (user.role !== 'STUDENT' && user.role !== 'ADMIN') {
      // Ensure activated users have STUDENT role
      sqlite
        .prepare('UPDATE "users" SET role = ?, updatedAt = ? WHERE id = ?')
        .run('STUDENT', new Date().toISOString(), user.id);
    }

    // Find the course by slug
    const slug = programToSlug[app.program] ?? app.program;
    let course: any = sqlite
      .prepare('SELECT id, title, slug FROM "Course" WHERE slug = ?')
      .get(slug);
    if (!course) {
      // Try lowercase table
      course = sqlite
        .prepare('SELECT id, title, slug FROM courses WHERE slug = ?')
        .get(slug);
    }
    if (!course) {
      return NextResponse.json(
        { error: `Course not found for program "${app.program}"` },
        { status: 404 }
      );
    }

    // Check if already enrolled
    let enrollment: any = sqlite
      .prepare('SELECT id FROM "Enrollment" WHERE userId = ? AND courseId = ?')
      .get(user.id, course.id);
    if (!enrollment) {
      // Try lowercase table
      enrollment = sqlite
        .prepare('SELECT id FROM enrollments WHERE userId = ? AND courseId = ?')
        .get(user.id, course.id);
    }

    let enrolled = false;
    if (!enrollment) {
      const eid =
        (globalThis as any).crypto?.randomUUID?.() ?? Date.now().toString();
      const now = new Date().toISOString();
      try {
        sqlite
          .prepare(
            `INSERT INTO "Enrollment" (id, userId, courseId, status, progress, enrolledAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .run(eid, user.id, course.id, "active", 0, now, now);
        enrolled = true;
      } catch {
        // Try lowercase table
        sqlite
          .prepare(
            `INSERT INTO enrollments (id, userId, courseId, status, progress, enrolledAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .run(eid, user.id, course.id, "active", 0, now, now);
        enrolled = true;
      }
    }

    // Mark the application as "activated" so admin knows it's done
    sqlite
      .prepare('UPDATE "applications" SET status = ? WHERE id = ?')
      .run("activated", applicationId);

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
