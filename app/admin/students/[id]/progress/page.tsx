import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminBack from '@/components/AdminBack';

export default async function StudentProgressPage(props: any) {
  const { params } = props;
  const session = await auth();
  if (!session?.user) return redirect('/login?callbackUrl=/admin');
  if (session.user.role !== 'ADMIN') return redirect('/dashboard');

  const { id } = await params;
  const user = sqlite.prepare('SELECT id, name, email, createdAt FROM "users" WHERE id = ?').get(id) as any;
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060606] text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
        <p className="text-sm text-white/40">No student account found for the given id.</p>
      </div>
    );
  }

  // fetch enrollments for this user
  const enrollments = sqlite.prepare(
    `SELECT e.id as enrollmentId, e.courseId, e.progress as progress, e.enrolledAt, c.title as courseTitle
     FROM "Enrollment" e
     LEFT JOIN "Course" c ON c.id = e.courseId
     WHERE e.userId = ?`
  ).all(id) as any[];

  // For each course, compute lesson count and completed count
  const courseProgress = enrollments.map((en) => {
    const totalLessonsRow = sqlite.prepare(
      `SELECT COUNT(l.id) as cnt
       FROM "Lesson" l
       JOIN "Module" m ON m.id = l.moduleId
       WHERE m.courseId = ?`
    ).get(en.courseId) as any;
    const total = totalLessonsRow?.cnt ?? 0;
    const completedRow = sqlite.prepare(
      `SELECT COUNT(p.id) as cnt
       FROM "Progress" p
       JOIN "Lesson" l ON l.id = p.lessonId
       JOIN "Module" m ON m.id = l.moduleId
       WHERE p.userId = ? AND m.courseId = ? AND p.completed = 1`
    ).get(id, en.courseId) as any;
    const completed = completedRow?.cnt ?? 0;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // fetch lesson-level status
    const lessons = sqlite.prepare(
      `SELECT l.id, l.title, COALESCE(p.completed, 0) as completed
       FROM "Lesson" l
       JOIN "Module" m ON m.id = l.moduleId
       LEFT JOIN "Progress" p ON p.lessonId = l.id AND p.userId = ?
      WHERE m.courseId = ?
      ORDER BY l.createdAt ASC`)
      .all(id, en.courseId) as any[];

    return { enrollmentId: en.enrollmentId, courseId: en.courseId, courseTitle: en.courseTitle, total, completed, pct, lessons };
  });

  return (
    <div className="min-h-screen bg-[#060606] text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <AdminBack fallback="/admin" />
            <div>
              <h1 className="text-2xl font-display font-bold">Progress — {user.name}</h1>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {courseProgress.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center">
              <p className="text-white/40">No enrollments found for this student.</p>
            </div>
          ) : (
            courseProgress.map((c) => (
              <div key={c.courseId} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{c.courseTitle}</h3>
                    <p className="text-xs text-white/30">{c.completed}/{c.total} lessons complete</p>
                  </div>
                  <div className="text-sm text-white/30">{c.pct}%</div>
                </div>
                <div className="border-t border-white/[0.04] pt-3">
                  <ul className="space-y-2">
                    {c.lessons.map((l: any) => (
                      <li key={l.id} className="flex items-center justify-between">
                        <span className={`truncate ${l.completed ? 'text-emerald-300' : 'text-white/60'}`}>{l.title}</span>
                        <span className="text-xs text-white/30">{l.completed ? 'Completed' : 'Incomplete'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
