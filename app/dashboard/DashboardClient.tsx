'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

/* -- Icons -- */
function IconGrid() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>; }
function IconBook() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>; }
function IconTrophy() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.563-2.156 1.076a3.186 3.186 0 00-.554 1.755c0 1.397 1.298 2.594 3.21 3.145M18.75 4.236c.996.178 1.768.563 2.156 1.076.39.517.554 1.11.554 1.755 0 1.397-1.298 2.594-3.21 3.145" /></svg>; }
function IconCheck() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconArrow() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>; }
function IconUser() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>; }
function IconLogout() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>; }
function IconHome() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>; }
function IconSettings() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function IconRefresh({ spinning }: { spinning?: boolean }) { return <svg className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" /></svg>; }

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  enrollments: any[];
  certificates: any[];
}

export default function DashboardClient({ user, enrollments: initialEnrollments, certificates: initialCertificates }: DashboardClientProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.enrollments);
        setCertificates(data.certificates);
        setLastRefreshed(new Date());
      }
    } catch {}
    setRefreshing(false);
  };

  const completedCount = enrollments.filter(e => e.status === 'completed').length;
  const inProgressCount = enrollments.length - completedCount;
  const firstName = user.name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display font-bold text-sm text-white/80 hover:text-white transition-colors">
              CreatINN
            </Link>
            <div className="h-5 w-px bg-white/[0.08]" />
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/[0.06] rounded-lg">
                <IconGrid /> Dashboard
              </Link>
              <Link href="/courses" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.04] transition-all">
                <IconBook /> Courses
              </Link>
              <Link href="/dashboard/certificates" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.04] transition-all">
                <IconTrophy /> Certificates
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20 hover:bg-accent-gold/20 transition-all">
                Admin
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/[0.06] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center text-black text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-white/60 hidden md:block">{firstName}</span>
                <svg className={`w-3 h-3 text-white/30 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 z-50 bg-[#141414] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[11px] text-white/30 truncate">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href="/dashboard/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                          <IconUser /> Profile
                        </Link>
                        <Link href="/dashboard/certificates" onClick={() => setShowMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                          <IconTrophy /> Certificates
                        </Link>
                        <Link href="/" onClick={() => setShowMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                          <IconHome /> Back to Site
                        </Link>
                      </div>
                      <div className="border-t border-white/[0.06] py-1.5">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                        >
                          <IconLogout /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-white/30 text-sm mb-1">Welcome back</p>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{firstName}</h1>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white text-xs font-semibold rounded-xl border border-white/[0.06] transition-all disabled:opacity-50"
                title="Refresh dashboard"
              >
                <IconRefresh spinning={refreshing} />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all"
              >
                Browse Courses <IconArrow />
              </Link>
            </div>
          </div>
          {lastRefreshed && (
            <p className="text-[11px] text-white/20 mt-2">Last updated: {lastRefreshed.toLocaleTimeString()}</p>
          )}
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: enrollments.length, label: 'Enrolled', sub: 'Courses', color: 'from-purple-400 to-purple-600', icon: <IconBook /> },
            { value: inProgressCount, label: 'In Progress', sub: 'Active', color: 'from-blue-400 to-blue-600', icon: <IconGrid /> },
            { value: completedCount, label: 'Completed', sub: 'Finished', color: 'from-emerald-400 to-emerald-600', icon: <IconCheck /> },
            { value: certificates.length, label: 'Certificates', sub: 'Earned', color: 'from-accent-gold to-amber-600', icon: <IconTrophy /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent p-[1px]">
                <div className="w-full h-full rounded-2xl bg-[#0c0c0c]" />
              </div>
              <div className="relative z-10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-[11px] text-white/20 font-medium">{stat.sub}</span>
                </div>
                <p className="text-2xl font-display font-bold mb-0.5">{stat.value}</p>
                <p className="text-[11px] text-white/35 uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">My Courses</h2>
              <p className="text-xs text-white/30 mt-0.5">Continue where you left off</p>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-[1px]">
                <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
              </div>
              <div className="relative z-10 py-20 px-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <IconBook />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">No courses yet</h3>
                <p className="text-white/35 text-sm mb-6 max-w-sm mx-auto">
                  Start your learning journey by enrolling in one of our premium programs
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-accent-gold transition-all"
                >
                  Browse Courses <IconArrow />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrollments.map((enrollment, index) => {
                const progress = enrollment.progress ?? 0;
                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Card border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-transparent p-[1px]">
                      <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Thumbnail */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-950/50 to-black">
                                          {enrollment.course.thumbnail ? (
                                            <Image src={enrollment.course.thumbnail} alt={enrollment.course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                          ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center">
                              <IconBook />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/30 to-transparent" />

                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm border ${
                            progress >= 100
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : progress > 0
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-white/10 text-white/50 border-white/10'
                          }`}>
                            {progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-display font-bold mb-2 leading-tight group-hover:text-white transition-colors">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                          {enrollment.course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] text-white/30 uppercase tracking-wider font-medium">Progress</span>
                            <span className="text-[11px] font-bold text-white/50">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                progress >= 100
                                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                  : 'bg-gradient-to-r from-accent-gold to-amber-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          href={`/course/${enrollment.course.slug}`}
                          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white border border-white/[0.06] group/btn"
                        >
                          {progress === 0 ? 'Start Course' : progress >= 100 ? 'Review Course' : 'Continue Learning'}
                          <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5"><IconArrow /></span>
                        </Link>
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_-20px_rgba(168,85,247,0.06)]" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">Certificates</h2>
                <p className="text-xs text-white/30 mt-0.5">Your earned achievements</p>
              </div>
              <Link href="/dashboard/certificates" className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1">
                View All <IconArrow />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.slice(0, 3).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative rounded-3xl overflow-hidden"
                >
                  {/* Gold border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-accent-gold/30 via-accent-gold/10 to-transparent p-[1px]">
                    <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                  </div>

                  <div className="relative z-10 p-7">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 border border-accent-gold/15 flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                        Verified
                      </span>
                    </div>
                    <h3 className="text-base font-display font-bold mb-1 group-hover:text-accent-gold transition-colors">{cert.courseTitle}</h3>
                    <p className="text-[11px] text-white/25 mb-5">
                      Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-accent-gold/10 text-accent-gold border border-accent-gold/15 hover:bg-accent-gold/20 transition-all"
                      >
                        Download Certificate
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
