'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

/* -- Icons -- */
function IconGrid() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function IconBook() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>; }
function IconUsers() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function IconClipboard() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>; }
function IconBell() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>; }
function IconLogout() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>; }
function IconExternal() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>; }
function IconPlus() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>; }
function IconRefresh({ spinning }: { spinning?: boolean }) { return <svg className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" /></svg>; }

interface AdminDashboardClientProps {
  stats: {
    totalStudents: number;
    totalCourses: number;
    totalEnrollments: number;
  };
  recentEnrollments: any[];
  courses: any[];
  pendingApplications: any[];
  students?: any[];
}

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: IconGrid },
  { key: 'courses', label: 'Courses', icon: IconBook },
  { key: 'students', label: 'Students', icon: IconUsers },
  { key: 'applications', label: 'Applications', icon: IconClipboard },
] as const;

export default function AdminDashboardClient({
  stats,
  recentEnrollments,
  courses,
  pendingApplications,
  students = [],
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1200);
  };
  const [coursesData, setCoursesData] = useState(courses);
  const [studentsData, setStudentsData] = useState(students);
  const [allApplications, setAllApplications] = useState<any[] | null>(null);
  const [appsLoading, setAppsLoading] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [appsFilter, setAppsFilter] = useState<string>('all');
  const [studentActionId, setStudentActionId] = useState<string | null>(null);
  const [studentActionType, setStudentActionType] = useState<'revoke' | 'restore' | 'delete' | null>(null);
  const [studentActionLoading, setStudentActionLoading] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    email: string;
    password: string | null;
    alreadyActive: boolean;
    courseTitle: string;
    courseSlug: string;
    enrolled: boolean;
    alreadyEnrolled: boolean;
  } | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await fetch('/api/applications');
      if (res.ok) setAllApplications(await res.json());
    } catch {}
    setAppsLoading(false);
  };

  const updateAppStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setAllApplications((prev) =>
          prev ? prev.map((a) => (a.id === id ? { ...a, status } : a)) : prev
        );
      } else alert('Failed to update status');
    } catch { alert('Failed to update status'); }
  };

  const activateAndEnroll = async (applicationId: string) => {
    setActivatingId(applicationId);
    try {
      const res = await fetch('/api/applications/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCredentialsModal(data);
        setAllApplications((prev) =>
          prev ? prev.map((a) => (a.id === applicationId ? { ...a, status: 'activated' } : a)) : prev
        );
      } else alert(data.error ?? 'Failed to activate');
    } catch { alert('Network error'); }
    setActivatingId(null);
  };

  const handleStudentAction = async () => {
    if (!studentActionId || !studentActionType) return;
    setStudentActionLoading(true);
    try {
      if (studentActionType === 'delete') {
        const res = await fetch(`/api/admin/students/${studentActionId}`, { method: 'DELETE' });
        if (res.ok) {
          setStudentsData((prev) => prev.filter((s: any) => s.id !== studentActionId));
        } else {
          const data = await res.json();
          alert(data.error ?? 'Failed to delete student');
        }
      } else {
        const res = await fetch(`/api/admin/students/${studentActionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: studentActionType }),
        });
        if (res.ok) {
          setStudentsData((prev) =>
            prev.map((s: any) =>
              s.id === studentActionId
                ? {
                    ...s,
                    role: studentActionType === 'revoke' ? 'REVOKED' : 'STUDENT',
                    enrollmentStatus: studentActionType === 'revoke' ? 'revoked' : 'active',
                  }
                : s
            )
          );
        } else {
          const data = await res.json();
          alert(data.error ?? 'Action failed');
        }
      }
    } catch {
      alert('Network error');
    }
    setStudentActionLoading(false);
    setStudentActionId(null);
    setStudentActionType(null);
  };

  const pendingCount = pendingApplications.length;

  const StatCard = ({ value, label, accent, delay = 0 }: { value: number; label: string; accent: string; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${accent}`} />
      <p className="text-4xl font-bold tracking-tight mb-1">{value}</p>
      <p className="text-sm text-white/40">{label}</p>
    </motion.div>
  );

  const statusColor = (s: string) =>
    s === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
    : s === 'accepted' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
    : s === 'shortlisted' ? 'bg-sky-500/15 text-sky-400 border-sky-500/20'
    : s === 'activated' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
    : 'bg-red-500/15 text-red-400 border-red-500/20';

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-[#0a0a0a] border-r border-white/[0.06] hidden lg:flex flex-col z-50">
        <div className="px-6 pt-7 pb-5">
          <Link href="/" className="block">
            <h1 className="font-display font-extrabold text-lg tracking-tight">CreatINN</h1>
            <p className="text-[11px] text-white/30 tracking-widest uppercase mt-0.5">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); if (key === 'applications') loadApplications(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              <Icon />
              {label}
              {key === 'applications' && pendingCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-[10px] font-bold rounded-full px-1.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/40 hover:text-white/70 rounded-xl hover:bg-white/[0.04] transition-all">
            <IconExternal /> View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
          >
            <IconLogout /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="px-4 h-14 flex items-center justify-between">
          <h1 className="font-display font-bold text-sm">CreatINN Admin</h1>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <button onClick={() => { setActiveTab('applications'); loadApplications(); }} className="relative p-2">
                <IconBell />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center bg-red-500 text-[9px] font-bold rounded-full">{pendingCount}</span>
              </button>
            )}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-white/40"><IconLogout /></button>
          </div>
        </div>
        <div className="flex border-t border-white/[0.04] overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); if (key === 'applications') loadApplications(); }}
              className={`flex-shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key ? 'border-white text-white' : 'border-transparent text-white/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-[220px] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-1">Dashboard</h2>
                  <p className="text-sm text-white/30">Welcome back. Here&apos;s what&apos;s happening.</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white text-xs font-semibold rounded-xl border border-white/[0.06] transition-all disabled:opacity-50"
                >
                  <IconRefresh spinning={refreshing} />
                  {refreshing ? 'Refreshing\u2026' : 'Refresh'}
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard value={stats.totalStudents} label="Students" accent="bg-purple-500" delay={0} />
                <StatCard value={stats.totalCourses} label="Courses" accent="bg-blue-500" delay={0.05} />
                <StatCard value={stats.totalEnrollments} label="Enrollments" accent="bg-emerald-500" delay={0.1} />
              </div>

              {pendingApplications.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Pending Applications</h3>
                    <button onClick={() => { setActiveTab('applications'); loadApplications(); }} className="text-xs text-white/40 hover:text-white transition-colors">
                      View all &rarr;
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pendingApplications.slice(0, 4).map((app) => (
                      <div key={app.id} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xs font-bold">
                            {(app.user?.name || '?')[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{app.user?.name}</p>
                            <p className="text-xs text-white/30">{app.program} &middot; {new Date(app.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setActiveTab('applications'); loadApplications(); setExpandedAppId(app.id); }}
                          className="px-3 py-1.5 text-xs font-medium bg-white/[0.06] hover:bg-white/10 rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="font-semibold mb-4">Recent Enrollments</h3>
                {recentEnrollments.length === 0 ? (
                  <p className="text-sm text-white/30">No enrollments yet.</p>
                ) : (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {/* Desktop / Tablet: table view */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Student</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Course</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider hidden sm:table-cell">Progress</th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Actions</th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider hidden md:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentEnrollments.map((e) => (
                            <tr key={e.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                              <td className="px-5 py-4">
                                <p className="text-sm font-medium">{e.user?.name}</p>
                                <p className="text-xs text-white/30">{e.user?.email}</p>
                              </td>
                              <td className="px-5 py-4 text-sm text-white/60">{e.course?.title}</td>
                              <td className="px-5 py-4 hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                                  </div>
                                  <span className="text-xs text-white/30">{e.progress || 0}%</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right">
                                {e.userId ? (
                                  <a href={`/admin/students/${e.userId}/progress`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] hover:bg-white/10 rounded-lg text-xs transition-all">
                                    Monitor
                                  </a>
                                ) : (
                                  <span className="text-xs text-white/30">—</span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-xs text-white/30 hidden md:table-cell">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile: stacked cards */}
                    <div className="md:hidden p-4 space-y-3">
                      {recentEnrollments.map((e) => (
                        <div key={e.id} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{e.user?.name}</p>
                              <p className="text-xs text-white/30 truncate">{e.user?.email}</p>
                            </div>
                            <div className="text-xs text-white/30">{new Date(e.enrolledAt).toLocaleDateString()}</div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-sm text-white/60 truncate">{e.course?.title}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${e.progress || 0}%` }} />
                              </div>
                              <span className="text-xs text-white/30">{e.progress || 0}%</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-end">
                            {e.userId ? (
                              <a href={`/admin/students/${e.userId}/progress`} className="px-3 py-2 bg-white/[0.06] hover:bg-white/10 text-xs rounded-lg transition-all">
                                Monitor Progress
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-1">Courses</h2>
                  <p className="text-sm text-white/30">{coursesData.length} course{coursesData.length !== 1 ? 's' : ''} total</p>
                </div>
                <Link
                  href="/admin/courses/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-accent-gold transition-all"
                >
                  <IconPlus /> New Course
                </Link>
              </div>

              <div className="space-y-4">
                {coursesData.map((course) => {
                  let displayDesc = course.description ?? '';
                  try { const p = JSON.parse(displayDesc); displayDesc = p.long || p.meta?.summary || ''; } catch {}
                  displayDesc = displayDesc.replace(/\\n/g, ' ').replace(/\n/g, ' ');

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all group"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 lg:w-56 shrink-0">
                          {course.thumbnail ? (
                            <div className="relative w-full h-36 md:h-full">
                              <Image src={course.thumbnail} alt="" fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-full h-36 md:h-full bg-gradient-to-br from-purple-900/30 to-black flex items-center justify-center">
                              <IconBook />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-display font-bold text-lg leading-tight mb-1">{course.title}</h3>
                              <div className="flex flex-wrap gap-2 text-[11px]">
                                {course.level && <span className="px-2 py-0.5 bg-white/[0.06] rounded-md text-white/40">{course.level}</span>}
                                {course.duration && <span className="px-2 py-0.5 bg-white/[0.06] rounded-md text-white/40">{course.duration}</span>}
                                {course.price > 0 && <span className="px-2 py-0.5 bg-white/[0.06] rounded-md text-white/40">&#x20A6;{Number(course.price).toLocaleString()}</span>}
                              </div>
                            </div>
                            <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                              course.isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {course.isPublished ? 'Live' : 'Draft'}
                            </span>
                          </div>

                          <p className="text-sm text-white/40 line-clamp-2 mb-4">{displayDesc || 'No description'}</p>

                          <div className="flex items-center gap-6 text-xs text-white/30 mb-5">
                            <span>{course._count?.enrollments ?? 0} enrolled</span>
                            <span>{course._count?.modules ?? 0} modules</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/courses/${course.slug}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-accent-gold transition-all"
                            >
                              Open Course Builder
                            </Link>
                            <Link
                              href={`/course/${course.slug}?from=admin-courses`}
                              className="px-3 py-2 bg-white/[0.06] hover:bg-white/10 text-xs rounded-lg transition-all"
                            >
                              Preview
                            </Link>
                            <button
                              onClick={async () => {
                                if (!confirm('Delete this course? This cannot be undone.')) return;
                                try {
                                  const res = await fetch(`/api/courses/${course.id}`, { method: 'DELETE' });
                                  if (res.ok) setCoursesData((c) => c.filter((x) => x.id !== course.id));
                                  else alert('Failed to delete course');
                                } catch { alert('Failed to delete course'); }
                              }}
                              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-all"
                            >
                              <IconTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {coursesData.length === 0 && (
                  <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
                    <div className="text-white/20"><IconBook /></div>
                    <p className="text-white/30 mt-3 text-sm">No courses yet</p>
                    <Link href="/admin/courses/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-accent-gold transition-all">
                      <IconPlus /> Create First Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-1">Enrolled Students</h2>
                <p className="text-sm text-white/30">{studentsData.length} student{studentsData.length !== 1 ? 's' : ''} total</p>
              </div>

              {studentsData.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center">
                  <div className="text-white/20"><IconUsers /></div>
                  <p className="text-white/30 mt-3 text-sm">No activated students yet.</p>
                  <p className="text-white/20 text-xs mt-1">Accept and activate applications to see students here.</p>
                </div>
              ) : (
                <>
                  {/* Desktop / Tablet: table */}
                  <div className="hidden md:block bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Student</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Course</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider hidden md:table-cell">Enrolled</th>
                          <th className="text-left px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Status</th>
                          <th className="text-right px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsData.map((s: any, i: number) => (
                          <tr key={`${s.id}-${i}`} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                            <td className="px-5 py-4">
                              <p className="text-sm font-medium">{s.name}</p>
                              <p className="text-xs text-white/30">{s.email}</p>
                            </td>
                            <td className="px-5 py-4 text-sm text-white/40 hidden sm:table-cell">{s.phone || '\u2014'}</td>
                            <td className="px-5 py-4">
                              {s.courseTitle ? (
                                <span className="inline-block px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-xs font-medium">{s.courseTitle}</span>
                              ) : (
                                <span className="text-white/20 text-xs">\u2014</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs text-white/30 hidden md:table-cell">{s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : '\u2014'}</td>
                            <td className="px-5 py-4">
                              {s.role === 'REVOKED' || s.enrollmentStatus === 'revoked' ? (
                                <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[11px] font-semibold">Revoked</span>
                              ) : s.enrollmentStatus === 'active' ? (
                                <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[11px] font-semibold">Active</span>
                              ) : (
                                <span className="text-white/20 text-xs">{s.enrollmentStatus || '\u2014'}</span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {s.role === 'REVOKED' || s.enrollmentStatus === 'revoked' ? (
                                  <button
                                    onClick={() => { setStudentActionId(s.id); setStudentActionType('restore'); }}
                                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[11px] font-semibold transition-all"
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => { setStudentActionId(s.id); setStudentActionType('revoke'); }}
                                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-[11px] font-semibold transition-all"
                                  >
                                    Revoke
                                  </button>
                                )}
                                <button
                                  onClick={() => { setStudentActionId(s.id); setStudentActionType('delete'); }}
                                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
                                >
                                  <IconTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: stacked student cards */}
                  <div className="md:hidden space-y-3">
                    {studentsData.map((s: any) => (
                      <div key={s.id} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{s.name}</p>
                            <p className="text-xs text-white/30 truncate">{s.email}</p>
                          </div>
                          <div className="text-xs text-white/30">{s.phone || '\u2014'}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            {s.courseTitle ? (
                              <span className="inline-block px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-xs font-medium">{s.courseTitle}</span>
                            ) : (
                              <span className="text-white/20 text-xs">\u2014</span>
                            )}
                          </div>
                          <div>
                            {s.role === 'REVOKED' || s.enrollmentStatus === 'revoked' ? (
                              <span className="inline-block px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[11px] font-semibold">Revoked</span>
                            ) : s.enrollmentStatus === 'active' ? (
                              <span className="inline-block px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[11px] font-semibold">Active</span>
                            ) : (
                              <span className="text-white/20 text-xs">{s.enrollmentStatus || '\u2014'}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          {s.role === 'REVOKED' || s.enrollmentStatus === 'revoked' ? (
                            <button
                              onClick={() => { setStudentActionId(s.id); setStudentActionType('restore'); }}
                              className="flex-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-semibold transition-all"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => { setStudentActionId(s.id); setStudentActionType('revoke'); }}
                              className="flex-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-sm font-semibold transition-all"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            onClick={() => { setStudentActionId(s.id); setStudentActionType('delete'); }}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-1">Applications</h2>
                  <p className="text-sm text-white/30">Manage incoming applications</p>
                </div>
                <button
                  onClick={loadApplications}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 rounded-lg text-xs font-medium transition-all"
                >
                  Refresh
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'shortlisted', 'accepted', 'activated', 'rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setAppsFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
                      appsFilter === f
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white/40 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {appsLoading && <p className="text-sm text-white/30">Loading&hellip;</p>}

              {!appsLoading && allApplications === null && (
                <div className="text-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <p className="text-white/30 text-sm mb-4">Click Refresh to load applications</p>
                  <button onClick={loadApplications} className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/10 rounded-xl text-sm font-medium transition-all">Load Applications</button>
                </div>
              )}

              {!appsLoading && allApplications && (() => {
                const filtered = appsFilter === 'all' ? allApplications : allApplications.filter((a) => a.status === appsFilter);
                if (filtered.length === 0) return <p className="text-sm text-white/30 py-8 text-center">No applications match this filter.</p>;
                return (
                  <div className="space-y-3">
                    {filtered.map((app) => (
                      <div key={app.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.10] transition-all">
                        <div
                          className="flex items-center justify-between px-5 py-4 cursor-pointer"
                          onClick={() => setExpandedAppId(expandedAppId === app.id ? null : app.id)}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                              {(app.user?.name || '?')[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{app.user?.name || 'Unknown'}</p>
                              <p className="text-xs text-white/30 truncate">{app.user?.email} &middot; <span className="capitalize">{app.program}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize border ${statusColor(app.status)}`}>
                              {app.status}
                            </span>
                            <span className="text-white/20 text-xs hidden sm:block">{new Date(app.submittedAt).toLocaleDateString()}</span>
                            <svg className={`w-3.5 h-3.5 text-white/20 transition-transform ${expandedAppId === app.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedAppId === app.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-white/[0.06] px-5 py-5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Experience</p>
                                    <p className="text-sm text-white/70 whitespace-pre-wrap">{app.experience}</p>
                                  </div>
                                  <div>
                                    <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Motivation</p>
                                    <p className="text-sm text-white/70 whitespace-pre-wrap">{app.motivation}</p>
                                  </div>
                                </div>
                                {app.user?.phone && (
                                  <div>
                                    <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-sm text-white/70">{app.user.phone}</p>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-2">
                                  {app.status !== 'accepted' && (
                                    <button onClick={() => updateAppStatus(app.id, 'accepted')} className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold transition-all">Accept</button>
                                  )}
                                  {app.status !== 'shortlisted' && (
                                    <button onClick={() => updateAppStatus(app.id, 'shortlisted')} className="px-3.5 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-semibold transition-all">Shortlist</button>
                                  )}
                                  {app.status !== 'rejected' && (
                                    <button onClick={() => updateAppStatus(app.id, 'rejected')} className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold transition-all">Reject</button>
                                  )}
                                  {app.status !== 'pending' && (
                                    <button onClick={() => updateAppStatus(app.id, 'pending')} className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/40 rounded-lg text-xs transition-all">Reset</button>
                                  )}
                                </div>

                                {app.status === 'accepted' && (
                                  <div className="pt-4 border-t border-white/[0.06]">
                                    <p className="text-xs text-white/30 mb-3">Payment confirmed offline? Grant course access:</p>
                                    <button
                                      onClick={() => activateAndEnroll(app.id)}
                                      disabled={activatingId === app.id}
                                      className="px-5 py-2.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-accent-gold transition-all disabled:opacity-50"
                                    >
                                      {activatingId === app.id ? 'Activating\u2026' : 'Activate & Enroll'}
                                    </button>
                                  </div>
                                )}
                                {app.status === 'activated' && (
                                  <div className="pt-4 border-t border-white/[0.06]">
                                    <p className="text-xs text-emerald-400 font-semibold">{'\u2713'} Activated &mdash; student has course access</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </main>

      {/* Credentials Modal */}
      <AnimatePresence>
        {credentialsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-display font-bold mb-1">
                {credentialsModal.alreadyActive ? 'Enrollment Added' : 'Account Activated'}
              </h3>
              <p className="text-white/30 text-sm mb-6">
                {credentialsModal.alreadyActive
                  ? 'Student already has an account. New enrollment added.'
                  : 'New account created. Share these credentials with the student.'}
              </p>

              <div className="space-y-3">
                <div className="bg-white/[0.04] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Course</p>
                  <p className="font-semibold text-sm">{credentialsModal.courseTitle}</p>
                </div>
                <div className="bg-white/[0.04] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Login Email</p>
                  <p className="font-mono text-accent-gold text-sm select-all">{credentialsModal.email}</p>
                </div>
                {credentialsModal.password ? (
                  <div className="bg-white/[0.04] rounded-xl p-4 border border-accent-gold/20">
                    <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Generated Password</p>
                    <p className="font-mono text-lg font-bold select-all tracking-wider">{credentialsModal.password}</p>
                    <p className="text-[11px] text-amber-400/70 mt-2">Shown only once &mdash; copy now.</p>
                  </div>
                ) : (
                  <div className="bg-white/[0.04] rounded-xl p-4">
                    <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Password</p>
                    <p className="text-sm text-white/40">Student already has credentials.</p>
                  </div>
                )}
                {credentialsModal.alreadyEnrolled && (
                  <p className="text-xs text-amber-400">Note: Student was already enrolled in this course.</p>
                )}
                <div className="bg-white/[0.04] rounded-xl p-4">
                  <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Course Link</p>
                  <p className="font-mono text-xs text-accent-gold select-all break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/course/${credentialsModal.courseSlug}` : `/course/${credentialsModal.courseSlug}`}
                  </p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/course/${credentialsModal.courseSlug}`); alert('Copied!'); }}
                    className="mt-2 px-3 py-1.5 bg-white/[0.06] hover:bg-white/10 rounded-lg text-[11px] font-semibold transition-all"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCredentialsModal(null)}
                className="mt-6 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-accent-gold transition-all text-sm"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Action Confirmation Modal */}
      <AnimatePresence>
        {studentActionId && studentActionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4"
            >
              {studentActionType === 'delete' ? (
                <>
                  <h3 className="text-lg font-display font-bold mb-1 text-red-400">Delete Student Permanently</h3>
                  <p className="text-white/40 text-sm mb-6">
                    This will permanently delete this student and all their data including enrollments, progress, payments, and applications. This action <strong className="text-red-400">cannot be undone</strong>.
                  </p>
                </>
              ) : studentActionType === 'revoke' ? (
                <>
                  <h3 className="text-lg font-display font-bold mb-1 text-amber-400">Revoke Student Access</h3>
                  <p className="text-white/40 text-sm mb-6">
                    This will suspend access for this student. Their enrollments will be marked as revoked and they will not be able to access course content. You can restore access later.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-display font-bold mb-1 text-emerald-400">Restore Student Access</h3>
                  <p className="text-white/40 text-sm mb-6">
                    This will restore access for this student. Their enrollments will be reactivated and they will be able to access course content again.
                  </p>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStudentActionId(null); setStudentActionType(null); }}
                  disabled={studentActionLoading}
                  className="flex-1 py-3 bg-white/[0.06] hover:bg-white/10 text-white/60 font-semibold rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStudentAction}
                  disabled={studentActionLoading}
                  className={`flex-1 py-3 font-bold rounded-xl text-sm transition-all disabled:opacity-50 ${
                    studentActionType === 'delete'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : studentActionType === 'revoke'
                      ? 'bg-amber-500 hover:bg-amber-600 text-black'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                  }`}
                >
                  {studentActionLoading
                    ? 'Processing\u2026'
                    : studentActionType === 'delete'
                    ? 'Delete Forever'
                    : studentActionType === 'revoke'
                    ? 'Revoke Access'
                    : 'Restore Access'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
