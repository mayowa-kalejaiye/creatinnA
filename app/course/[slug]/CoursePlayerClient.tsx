'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReactPlayer from 'react-player';
const RP: any = ReactPlayer;
import { motion, AnimatePresence } from 'framer-motion';

/* -- Types -- */
type Lesson = {
  id: string; title: string;
  content?: string | null; videoUrl?: string | null;
  duration?: string | null; order?: number;
};
type Module = {
  id: string; title: string;
  description?: string | null; order?: number;
  lessons: Lesson[];
};
type Course = {
  id: string; title: string; slug: string; description: string;
  price: number; duration: string; level: string;
  category: string; thumbnail?: string | null; modules: Module[];
};
type Progress = {
  id: string; lessonId: string;
  completed: boolean | number; lastWatched?: Date;
};

/* -- Helpers -- */
function safe<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
}
function plainDesc(desc: string) {
  try {
    const p = JSON.parse(desc);
    if (p && typeof p === 'object') return p.long || p.meta?.summary || '';
  } catch {} return desc || '';
}

/* Ensure lesson video URLs are usable by ReactPlayer (normalize IDs, add protocol) */
function normalizeVideoUrl(url?: string | null) {
  if (!url) return null;
  const s = String(url).trim();
  if (!s) return null;

  // If already an absolute URL, return as-is (ensure protocol)
  if (/^https?:\/\//i.test(s)) return s;

  // If it's a YouTube short link or id-like string, try to extract ID
  const ytIdMatch = s.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  if (ytIdMatch && ytIdMatch[1]) return `https://www.youtube.com/watch?v=${ytIdMatch[1]}`;

  // If it's just a plain youtube id (11 chars), treat it as an id
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return `https://www.youtube.com/watch?v=${s}`;

  // If it looks like a protocol-less host path (e.g. www.youtube.com/watch?v=...), add https://
  if (/^[^\s]+\.[^\s]+/.test(s)) return `https://${s}`;

  return s;
}

/* -- Icons -- */
function IconCheck({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}
function IconPlay({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
}
function IconLock({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
}
function IconBook({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
}
function IconBack({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
}
function IconChevron({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
}
function IconMenu({ className = 'w-5 h-5' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
}
function IconX({ className = 'w-5 h-5' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
}
function IconClock({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconSignal({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
}
function IconGrid({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>;
}
function IconSpinner({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;
}

/* ================================================================= */
/*  COURSE PLAYER                                                    */
/* ================================================================= */
export default function CoursePlayerClient({
  course,
  isEnrolled,
  progress,
}: { course: Course; isEnrolled: boolean;
  progress: Progress[];
}) {
  const modules = safe(course.modules);
  const progressArr = safe(progress);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from');
  const allLessons = modules.flatMap(m => safe(m.lessons));

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(allLessons[0] || null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)));
  const [markingComplete, setMarkingComplete] = useState(false);
  const [tab, setTab] = useState<'content' | 'notes'>('content');
  const mainRef = useRef<HTMLDivElement>(null);

  const isCompleted = (lid: string) => progressArr.some(p => p.lessonId === lid && !!p.completed);

  const markComplete = async (lid: string) => {
    setMarkingComplete(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lid, completed: true }),
      });
      router.refresh();
    } catch {} finally {
      setMarkingComplete(false);
    }
  };

  const completedCount = progressArr.filter(p => !!p.completed).length;
  const totalCount = allLessons.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const idx = allLessons.findIndex(l => l.id === currentLesson?.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const toggleModule = (id: string) => {
    setExpandedModules(p => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const go = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setMobileSidebar(false);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findParentModule = (lessonId: string) => modules.find(m => m.lessons.some(l => l.id === lessonId));

  /* ---------------------------------------------------------------- */
  /*  NOT ENROLLED — Course Preview / Landing                         */
  /* ---------------------------------------------------------------- */
  if (!isEnrolled) {
    const desc = plainDesc(course.description);
    return (
      <div className="min-h-screen bg-[#060606] text-white">
        {/* Hero */}
        <div className="relative h-[420px] md:h-[480px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060606]/70 to-[#060606] z-10" />
          {course.thumbnail ? (
            <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-950/40 via-[#0a0a0a] to-[#060606]" />
          )}
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="max-w-6xl mx-auto w-full px-6 pb-14">
              {from === 'admin-courses' ? (
                <button onClick={() => router.push('/admin')} className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium mb-6 transition-colors">
                  <IconBack className="w-3.5 h-3.5" /> Back to Courses
                </button>
              ) : (
                <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium mb-6 transition-colors">
                  <IconBack className="w-3.5 h-3.5" /> Back to Courses
                </Link>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {course.level && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.08] backdrop-blur-sm rounded-lg text-[11px] font-medium text-white/70">
                    <IconSignal className="w-3 h-3" />{course.level}
                  </span>
                )}
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.08] backdrop-blur-sm rounded-lg text-[11px] font-medium text-white/70">
                    <IconClock className="w-3 h-3" />{course.duration}
                  </span>
                )}
                {course.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.08] backdrop-blur-sm rounded-lg text-[11px] font-medium text-white/70">
                    <IconGrid className="w-3 h-3" />{course.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-bold leading-[1.1] mb-4 max-w-3xl">{course.title}</h1>
              {desc && <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed line-clamp-3">{desc.split('\n')[0]}</p>}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-6xl mx-auto px-6 -mt-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-10 min-w-0">
              {/* About */}
              {desc && (
                <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                  <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                    <IconBook className="w-5 h-5 text-white/30" /> About This Course
                  </h2>
                  <p className="text-white/50 leading-relaxed whitespace-pre-line text-[15px]">{desc}</p>
                </section>
              )}
              {/* Course Outline */}
              {modules.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-display font-bold">Course Outline</h2>
                    <span className="text-xs text-white/30">
                      {modules.length} module{modules.length !== 1 ? 's' : ''} &middot; {allLessons.length} lesson{allLessons.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {modules.map((mod, mi) => {
                      const lessons = safe(mod.lessons);
                      const expanded = expandedModules.has(mod.id);
                      return (
                        <div key={mod.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] text-xs font-bold text-white/40 shrink-0`}>
                              {mi + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{mod.title}</p>
                              {mod.description && <p className="text-xs text-white/30 mt-0.5 truncate">{mod.description}</p>}
                            </div>
                            <span className="text-[11px] text-white/25 shrink-0">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
                            <IconChevron className={`w-3.5 h-3.5 text-white/20 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-white/[0.04]">
                                  {lessons.map((l) => (
                                    <div key={l.id} className="flex items-center gap-3 px-5 py-3 ml-4 text-white/40">
                                      <IconLock className="w-3 h-3 shrink-0 text-white/20" />
                                      <span className="flex-1 text-sm truncate">{l.title}</span>
                                      {l.duration && <span className="text-[11px] text-white/20 shrink-0">{l.duration}</span>}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right column — Sticky enroll card */}
            <div className="lg:col-span-1 min-w-0">
              <div className="sticky top-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden min-w-0">
                  {course.thumbnail && (
                  <div className="relative h-44">
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  </div>
                )}
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-3xl font-bold">
                      <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                        <span className="break-words">&#x20A6;{Number(course.price).toLocaleString()}</span>
                      </span>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      {course.duration && <span className="flex items-center gap-1"><IconClock className="w-3 h-3" />{course.duration}</span>}
                      {course.level && <span className="flex items-center gap-1"><IconSignal className="w-3 h-3" />{course.level}</span>}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[13px] text-white/50">
                    <div className="flex items-center gap-2.5">
                      <IconBook className="w-4 h-4 text-white/25" />
                      <span>{allLessons.length} lesson{allLessons.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <IconGrid className="w-4 h-4 text-white/25" />
                      <span>{modules.length} module{modules.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <Link
                      href={`/apply?program=${encodeURIComponent(course.title)}`}
                      className="block w-full px-6 py-3.5 bg-white text-black text-center font-bold rounded-xl hover:bg-accent-gold transition-all text-sm"
                    >
                      Apply for This Course
                    </Link>
                    <Link
                      href="/courses"
                      className="block w-full px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-center rounded-xl text-sm font-medium text-white/60 transition-all"
                    >
                      Browse All Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  ENROLLED — Full Course Player                                   */
  /* ---------------------------------------------------------------- */

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Sidebar header */}
      <div className={`${mobile ? 'px-5 py-4' : 'px-6 py-5'} border-b border-white/[0.06]`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white/80">Course Content</h2>
          {mobile && (
            <button onClick={() => setMobileSidebar(false)} className="p-1 hover:bg-white/[0.06] rounded-lg transition-colors">
              <IconX className="w-4 h-4 text-white/40" />
            </button>
          )}
          {!mobile && <span className="text-[11px] text-white/30 tabular-nums">{completedCount}/{totalCount}</span>}
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[11px] text-white/25 mt-1.5">{pct}% complete &middot; {completedCount} of {totalCount} lessons</p>
      </div>

      {/* Modules */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((mod, mi) => {
          const lessons = safe(mod.lessons);
          const done = lessons.filter(l => isCompleted(l.id)).length;
          const expanded = expandedModules.has(mod.id);
          const allDone = lessons.length > 0 && done === lessons.length;
          return (
            <div key={mod.id} className="border-b border-white/[0.04]">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 ${
                  allDone ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/40'
                }`}>
                  {allDone ? <IconCheck className="w-3.5 h-3.5" /> : mi + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-tight truncate">{mod.title}</p>
                  <p className="text-[11px] text-white/25 mt-0.5">{done}/{lessons.length} complete</p>
                </div>
                <IconChevron className={`w-3.5 h-3.5 text-white/20 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-2">
                      {lessons.map(lesson => {
                        const done = isCompleted(lesson.id);
                        const active = currentLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => go(lesson)}
                            className={`w-full flex items-center gap-3 pl-14 pr-5 py-2.5 text-left transition-all ${
                              active
                                ? 'bg-white/[0.07] text-white'
                                : 'text-white/45 hover:text-white/65 hover:bg-white/[0.02]'
                            }`}
                          >
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 transition-colors ${
                              done
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : active
                                  ? 'bg-white/10 text-white'
                                  : 'bg-white/[0.04] text-white/25'
                            }`}>
                              {done ? <IconCheck className="w-3 h-3" /> : <IconPlay className="w-2.5 h-2.5" />}
                            </span>
                            <span className="flex-1 text-[13px] leading-snug truncate">{lesson.title}</span>
                            {lesson.duration && <span className="text-[11px] text-white/20 shrink-0">{lesson.duration}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col">
      {/* -- Header -- */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 p-1.5 -ml-1.5 hover:bg-white/[0.06] rounded-lg transition-colors shrink-0 text-white/40 hover:text-white/60">
              <IconBack className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-medium">My Courses</span>
            </Link>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileSidebar(true)}
              className="md:hidden p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <IconMenu className="w-4 h-4 text-white/40" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm truncate">{course.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
              <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="text-[11px] text-white/40 tabular-nums font-medium">{pct}%</span>
            </div>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-[11px] font-medium text-white/50 transition-all border border-white/[0.06]"
            >
              <IconMenu className="w-3.5 h-3.5" />
              {sidebarOpen ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {/* Thin mobile progress */}
        <div className="sm:hidden w-full h-[2px] bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* -- Desktop Sidebar -- */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="hidden md:flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] overflow-hidden shrink-0"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* -- Mobile Sidebar Overlay -- */}
        <AnimatePresence>
          {mobileSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebar(false)}
            >
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="absolute inset-y-0 left-0 w-[85vw] max-w-[360px] bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <SidebarContent mobile />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -- Main Content -- */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div>
                  {/* Video Player */}
                  {(() => {
                    const playable = normalizeVideoUrl(currentLesson.videoUrl);
                    if (!playable) return null;

                    // If it's a YouTube link, render a plain iframe with the proper allow attributes
                    if (/youtube\.com|youtu\.be/.test(playable)) {
                      const idMatch = String(playable).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
                      const id = idMatch && idMatch[1] ? idMatch[1] : null;
                      const embedSrc = id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : playable.replace('watch?v=', 'embed/');
                      return (
                        <div className="bg-black">
                          <div className="max-w-5xl mx-auto">
                            <div className="aspect-video">
                              <iframe
                                key={playable}
                                src={embedSrc}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                                title={currentLesson.title || 'YouTube video player'}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Fallback to ReactPlayer for non-YouTube sources
                    return (
                      <div className="bg-black">
                        <div className="max-w-5xl mx-auto">
                          <div className="aspect-video">
                            {/* ReactPlayer type definitions can be strict; cast props to any for compatibility */}
                            <RP
                              key={playable}
                              {...({
                                url: playable,
                                width: '100%',
                                height: '100%',
                                controls: true,
                              } as any)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

              {/* Lesson Content */}
              <div className="max-w-4xl mx-auto px-5 md:px-8 py-8">
                {/* Breadcrumb & Title */}
                <div className="mb-8">
                  {(() => {
                    const mod = findParentModule(currentLesson.id);
                    return mod ? (
                      <p className="text-[11px] text-white/25 uppercase tracking-widest font-medium mb-2">{mod.title}</p>
                    ) : null;
                  })()}
                  <h2 className="text-xl md:text-2xl font-display font-bold leading-tight">{currentLesson.title}</h2>
                  {currentLesson.duration && (
                    <p className="text-xs text-white/30 mt-1.5 flex items-center gap-1.5">
                      <IconClock className="w-3 h-3" />{currentLesson.duration}
                    </p>
                  )}
                </div>

                {/* Tab switcher (only show if there are notes) */}
                {currentLesson.content && (
                  <div className="flex gap-1 mb-6 border-b border-white/[0.06] -mx-1">
                    <button
                      onClick={() => setTab('content')}
                      className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                        tab === 'content' ? 'border-white text-white' : 'border-transparent text-white/35 hover:text-white/55'
                      }`}
                    >
                      Lesson
                    </button>
                    <button
                      onClick={() => setTab('notes')}
                      className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                        tab === 'notes' ? 'border-white text-white' : 'border-transparent text-white/35 hover:text-white/55'
                      }`}
                    >
                      Notes & Resources
                    </button>
                  </div>
                )}

                {/* Tab content */}
                {(tab === 'content' || !currentLesson.content) && (
                  <div className="space-y-6">
                    {/* Action row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {!isCompleted(currentLesson.id) ? (
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => markComplete(currentLesson.id)}
                          disabled={markingComplete}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 text-sm"
                        >
                          {markingComplete ? (
                            <><IconSpinner className="w-4 h-4" /> Saving&hellip;</>
                          ) : (
                            <><IconCheck className="w-4 h-4" /> Mark Complete</>
                          )}
                        </motion.button>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-xl text-sm">
                          <IconCheck className="w-4 h-4" /> Completed
                        </div>
                      )}
                      {next && (
                        <button
                          onClick={() => go(next)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-sm font-medium rounded-xl transition-all border border-white/[0.06]"
                        >
                          Next Lesson <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      )}
                    </div>

                    {/* No video, show content inline */}
                    {!currentLesson.videoUrl && currentLesson.content && tab === 'content' && (
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                        <div className="text-white/55 leading-relaxed whitespace-pre-wrap text-[15px]">
                          {currentLesson.content}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tab === 'notes' && currentLesson.content && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <IconBook className="w-4 h-4 text-white/30" />
                      <h3 className="font-semibold text-sm text-white/60">Lesson Notes</h3>
                    </div>
                    <div className="text-white/55 leading-relaxed whitespace-pre-wrap text-[15px]">
                      {currentLesson.content}
                    </div>
                  </div>
                )}

                {/* Prev / Next */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
                  {prev ? (
                    <button
                      onClick={() => go(prev)}
                      className="group flex items-center gap-3 hover:bg-white/[0.03] rounded-xl px-4 py-3 -ml-4 transition-colors max-w-[45%]"
                    >
                      <IconBack className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-white/25">Previous</p>
                        <p className="text-sm font-medium text-white/60 group-hover:text-white truncate transition-colors">{prev.title}</p>
                      </div>
                    </button>
                  ) : <div />}
                  {next ? (
                    <button
                      onClick={() => go(next)}
                      className="group flex items-center gap-3 hover:bg-white/[0.03] rounded-xl px-4 py-3 -mr-4 transition-colors text-right max-w-[45%]"
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] text-white/25">Next</p>
                        <p className="text-sm font-medium text-white/60 group-hover:text-white truncate transition-colors">{next.title}</p>
                      </div>
                      <svg className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ) : (
                    pct === 100 && (
                      <div className="text-right">
                        <p className="text-[11px] text-emerald-400/60 mb-0.5">Course complete!</p>
                        <Link href="/dashboard" className="text-sm font-bold text-emerald-400 hover:underline">
                          Go to My Courses &rarr;
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* No lesson selected */
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-24">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                <IconPlay className="w-7 h-7 text-white/15" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Ready to learn?</h3>
              <p className="text-white/35 text-sm max-w-xs">Select a lesson from the sidebar to start learning</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
