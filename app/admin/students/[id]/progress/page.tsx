import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminBack from '@/components/AdminBack';
import { getUserById, getEnrollmentsForUser, getLessonsForCourseWithProgress } from '@/lib/db-adapter';

export default async function StudentProgressPage(props: any) {
  const { params } = props;
  const session = await auth();
  if (!session?.user) return redirect('/login?callbackUrl=/admin');
  if (session.user.role !== 'ADMIN') return redirect('/dashboard');

  const { id } = await params;
  const user = await getUserById(id as string)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060606] text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
        <p className="text-sm text-white/40">No student account found for the given id.</p>
      </div>
    );
  }

  const enrollments = await getEnrollmentsForUser(id as string)
  const courseProgress = [] as any[]
  for (const en of enrollments) {
    const lessons = await getLessonsForCourseWithProgress(id as string, en.courseId)
    const total = Array.isArray(lessons) ? lessons.length : 0
    const completed = Array.isArray(lessons) ? lessons.filter((l:any)=>Number(l.completed)===1).length : 0
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    courseProgress.push({ enrollmentId: en.enrollmentId || en.id, courseId: en.courseId, courseTitle: en.courseTitle, total, completed, pct, lessons })
  }

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
