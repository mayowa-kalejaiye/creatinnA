import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sqlite } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";


export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // If sqlite isn't available (serverless build/runtime), return a safe empty dashboard
  if (!sqlite) {
    console.warn('AdminDashboardPage: sqlite not available in this environment; returning empty dashboard data')
    return (
      <AdminDashboardClient
        stats={{ totalStudents: 0, totalCourses: 0, totalEnrollments: 0 }}
        recentEnrollments={[]}
        courses={[]}
        pendingApplications={[]}
        students={[]}
      />
    )
  }

  // Ensure core service programs exist so the admin can populate modules and content later
  const corePrograms = [
    {
      title: '2-Week Video Editing Intensive',
      slug: '2-week-video-editing-intensive',
      description: '3 students per cohort\nPhysical, mentor-led\nPremium positioning\nSkill certification',
      price: 100000,
      duration: '2 weeks',
      level: 'Beginner',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
    {
      title: '1-on-1 Mastery Track',
      slug: '1-on-1-mastery-track',
      description: 'High-touch mentorship\nFlexible schedule\nFor professionals\nPrivate access',
      price: 600000,
      duration: 'Flexible',
      level: 'Advanced',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
    {
      title: 'Online Video Editing',
      slug: 'online-video-editing',
      description: 'Self-paced learning\nDigital access\nNo mentorship\nSkill training only',
      price: 30000,
      duration: 'Self-paced',
      level: 'Beginner',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
  ];

  const nowIso = new Date().toISOString();
  for (const p of corePrograms) {
    const exists = sqlite.prepare('SELECT id FROM "Course" WHERE slug = ?').get(p.slug);
    if (!exists) {
      try {
        sqlite.prepare(
          `INSERT INTO "Course" (id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run((globalThis as any).crypto?.randomUUID?.() ?? String(Date.now()), p.title, p.slug, p.description, p.thumbnail, p.price, p.duration, p.level, p.isPublished, p.category, nowIso, nowIso);
      } catch (e) {
        // ignore insertion errors (table may not exist in some dev setups)
      }
    }
  }

  // Counts and revenue
  const totalStudentsRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "users" WHERE role = ?`).get('STUDENT');
  const totalCoursesRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "Course"`).get();
  const totalEnrollmentsRow = sqlite.prepare(`SELECT COUNT(1) as cnt FROM "Enrollment"`).get();
  const totalStudents = (totalStudentsRow as any)?.cnt ?? 0;
  const totalCourses = (totalCoursesRow as any)?.cnt ?? 0;
  const totalEnrollments = (totalEnrollmentsRow as any)?.cnt ?? 0;

  // Recent enrollments (with user name/email and course title)
  const recentEnrollments = sqlite
    .prepare(
      `SELECT e.id, e.userId, e.courseId, e.status, e.progress, e.enrolledAt,
              u.name as userName, u.email as userEmail,
              c.title as courseTitle
       FROM "Enrollment" e
       LEFT JOIN "users" u ON u.id = e.userId
       LEFT JOIN "Course" c ON c.id = e.courseId
       ORDER BY e.enrolledAt DESC
       LIMIT 10`
    )
    .all();

  // Normalize recentEnrollments to match client shape (nest user and course)
  const recentEnrollmentsNormalized = recentEnrollments.map((r: any) => ({
    id: r.id,
    userId: r.userId,
    courseId: r.courseId,
    status: r.status,
    // progress will be computed below if not present
    progress: r.progress,
    enrolledAt: r.enrolledAt,
    user: { name: r.userName, email: r.userEmail },
    course: { title: r.courseTitle },
  }));

  // Compute accurate progress percentages for recent enrollments
  for (const en of recentEnrollmentsNormalized) {
    try {
      const totalRow = sqlite.prepare(
        `SELECT COUNT(l.id) as cnt FROM "Lesson" l JOIN "Module" m ON m.id = l.moduleId WHERE m.courseId = ?`
      ).get(en.courseId) as any;
      const total = totalRow?.cnt ?? 0;
      if (total === 0) {
        en.progress = 0;
        continue;
      }
      const completedRow = sqlite.prepare(
        `SELECT COUNT(p.id) as cnt FROM "Progress" p JOIN "Lesson" l ON l.id = p.lessonId JOIN "Module" m ON m.id = l.moduleId WHERE p.userId = ? AND m.courseId = ? AND p.completed = 1`
      ).get(en.userId, en.courseId) as any;
      const completed = completedRow?.cnt ?? 0;
      en.progress = Math.round((completed / total) * 100);
    } catch (e) {
      // fallback to stored enrollment.progress or 0
      en.progress = en.progress ?? 0;
    }
  }

  // Courses with counts (enrollments, modules)
  const courses = sqlite
    .prepare(
      `SELECT c.*,
              COALESCE(ec.enroll_count, 0) AS enrollmentsCount,
              COALESCE(mc.module_count, 0) AS modulesCount
       FROM "Course" c
       LEFT JOIN (
         SELECT courseId, COUNT(1) AS enroll_count FROM "Enrollment" GROUP BY courseId
       ) ec ON ec.courseId = c.id
       LEFT JOIN (
         SELECT courseId, COUNT(1) AS module_count FROM "Module" GROUP BY courseId
       ) mc ON mc.courseId = c.id
       ORDER BY c.createdAt DESC`
    )
    .all();

  // Ensure courses include a Prisma-like _count object for enrollments/modules
  const coursesNormalized = courses.map((c: any) => ({
    ...c,
    _count: {
      enrollments: c.enrollmentsCount ?? 0,
      modules: c.modulesCount ?? 0,
    }
  }));

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

  // Normalize pending applications to include nested user
  const pendingApplicationsNormalized = pendingApplications.map((a: any) => ({
    ...a,
    user: { name: a.userName, email: a.userEmail, phone: a.userPhone }
  }));

  // Load student accounts with their enrollment info for admin view
  const studentsRaw = sqlite
    .prepare(`SELECT u.id, u.name, u.email, u.phone, u.role, u.createdAt,
                    e.courseId, e.enrolledAt as enrollmentDate, e.status as enrollmentStatus,
                    c.title as courseTitle
             FROM "users" u
             LEFT JOIN "Enrollment" e ON e.userId = u.id
             LEFT JOIN "Course" c ON c.id = e.courseId
             WHERE u.role != 'ADMIN' AND u.password != '__applicant__'
             ORDER BY u.createdAt DESC`)
    .all();

  const students = Array.isArray(studentsRaw)
    ? (studentsRaw as any[]).map(s => ({ id: s.id, name: s.name, email: s.email, phone: s.phone, role: s.role, createdAt: s.createdAt, courseTitle: s.courseTitle || null, enrollmentDate: s.enrollmentDate || null, enrollmentStatus: s.enrollmentStatus || null }))
    : [];

  return (
    <AdminDashboardClient
      stats={{
        totalStudents,
        totalCourses,
        totalEnrollments,
      }}
      recentEnrollments={recentEnrollmentsNormalized}
      courses={coursesNormalized}
      pendingApplications={pendingApplicationsNormalized}
      students={students}
    />
  );
}
