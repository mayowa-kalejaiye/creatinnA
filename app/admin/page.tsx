import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import {
  ensureCourseExists,
  countUsersByRole,
  countCourses,
  countEnrollments,
  getRecentEnrollments,
  getAllCoursesWithCounts,
  getPendingApplications,
  getStudentsWithEnrollment,
} from '@/lib/db-adapter';


export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
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
    try { await ensureCourseExists(p as any) } catch (e) { /* ignore */ }
  }

  // Counts and revenue
  const totalStudents = await countUsersByRole('STUDENT')
  const totalCourses = await countCourses()
  const totalEnrollments = await countEnrollments()

  // Recent enrollments (with user name/email and course title)
  const recentEnrollmentsRaw = await getRecentEnrollments(10)
  const recentEnrollmentsNormalized = recentEnrollmentsRaw.map((r: any) => {
    const total = (r._meta && r._meta.total_lessons) ? Number(r._meta.total_lessons) : 0
    const completed = (r._meta && r._meta.completed_lessons) ? Number(r._meta.completed_lessons) : 0
    const progress = r.progress ?? (total > 0 ? Math.round((completed / total) * 100) : 0)
    return {
      id: r.id,
      userId: r.userId,
      courseId: r.courseId,
      status: r.status,
      progress,
      enrolledAt: r.enrolledAt,
      user: r.user,
      course: r.course,
    }
  })

  // Courses with counts (enrollments, modules)
  const coursesNormalized = await getAllCoursesWithCounts()

  // Pending applications with user info
  const pendingApplicationsNormalized = await getPendingApplications()

  // Load student accounts with their enrollment info for admin view
  const students = await getStudentsWithEnrollment()

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
