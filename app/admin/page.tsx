import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sqlite } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Counts and revenue
  const totalStudentsRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "users" WHERE role = ?`).get('STUDENT');
  const totalCoursesRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "courses"`).get();
  const totalEnrollmentsRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "enrollments"`).get();
  const totalRevenueRow = sqlite.prepare(`SELECT COALESCE(SUM(amount), 0) as total FROM "payments" WHERE status = 'successful'`).get();

  const totalStudents = totalStudentsRow?.cnt ?? 0;
  const totalCourses = totalCoursesRow?.cnt ?? 0;
  const totalEnrollments = totalEnrollmentsRow?.cnt ?? 0;
  const totalRevenue = totalRevenueRow?.total ?? 0;

  // Recent enrollments (with user name/email and course title)
  const recentEnrollments = sqlite
    .prepare(
      `SELECT e.id, e.userId, e.courseId, e.status, e.progress, e.enrolledAt,
              u.name as userName, u.email as userEmail,
              c.title as courseTitle
       FROM "enrollments" e
       LEFT JOIN "users" u ON u.id = e.userId
       LEFT JOIN "courses" c ON c.id = e.courseId
       ORDER BY e.enrolledAt DESC
       LIMIT 10`
    )
    .all();

  // Courses with counts (enrollments, modules)
  const courses = sqlite
    .prepare(
      `SELECT c.*,
              COALESCE(ec.enroll_count, 0) AS enrollmentsCount,
              COALESCE(mc.module_count, 0) AS modulesCount
       FROM "courses" c
       LEFT JOIN (
         SELECT courseId, COUNT(1) AS enroll_count FROM "enrollments" GROUP BY courseId
       ) ec ON ec.courseId = c.id
       LEFT JOIN (
         SELECT courseId, COUNT(1) AS module_count FROM "modules" GROUP BY courseId
       ) mc ON mc.courseId = c.id
       ORDER BY c.createdAt DESC`
    )
    .all();

  // Pending applications with user info
  const pendingApplications = sqlite
    .prepare(
      `SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone
       FROM "applications" a
       LEFT JOIN "users" u ON u.id = a.userId
       WHERE a.status = 'pending'
       ORDER BY a.submittedAt DESC`
    )
    .all();

  return (
    <AdminDashboardClient
      stats={{
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenue,
      }}
      recentEnrollments={recentEnrollments}
      courses={courses}
      pendingApplications={pendingApplications}
    />
  );
}
