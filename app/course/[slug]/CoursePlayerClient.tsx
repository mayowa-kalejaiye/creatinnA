'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';

type Lesson = {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  duration?: string | null;
  order?: number;
};

type Module = {
  id: string;
  title: string;
  description?: string | null;
  order?: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  thumbnail?: string | null;
  modules: Module[];
};

type Progress = {
  id: string;
  lessonId: string;
  completed: boolean | number;
  lastWatched?: Date;
};

// Defensive: fallback for missing arrays
function safeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
}

export default function CoursePlayerClient({
  course,
  isEnrolled,
  progress
}: {
  course: Course;
  isEnrolled: boolean;
  progress: Progress[];
}) {
  // Defensive: ensure modules and lessons are arrays
  const modules = safeArray(course.modules);
  const progressArr = safeArray(progress);

  const router = useRouter();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    modules[0]?.lessons?.[0] || null
  );
  const [showSidebar, setShowSidebar] = useState(true);

  const isLessonCompleted = (lessonId: string) => {
    return progressArr.some(p => p.lessonId === lessonId && !!p.completed);
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, completed: true })
      });

      // Refresh to update progress
      router.refresh();
    } catch (error) {
      console.error('Failed to mark lesson complete');
    }
  };

  const completedLessons = progressArr.filter(p => p.completed).length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleEnroll = async () => {
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST'
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to enroll. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="glass rounded-3xl p-12 max-w-2xl text-center">
          <h1 className="text-3xl font-display font-bold mb-4 gradient-text">{course.title}</h1>
          <p className="text-white/70 mb-8">{course.description}</p>
          <div className="mb-8">
            <p className="text-4xl font-bold text-accent-gold mb-2">₦{course.price.toLocaleString()}</p>
            <p className="text-white/50">{course.duration} • {course.level}</p>
          </div>
          <div className="mb-8 text-left glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Course Includes:</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {course.modules.length} modules
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} video lessons
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lifetime access
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Certificate of completion
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleEnroll}
              className="w-full px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
            >
              Enroll Now - ₦{course.price.toLocaleString()}
            </button>
            <Link
              href="/courses"
              className="block w-full px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/70 hover:text-white">
              ← Dashboard
            </Link>
            <div>
              <h1 className="font-display font-bold gradient-text">{course.title}</h1>
              <p className="text-sm text-white/50">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden px-4 py-2 bg-white/10 rounded-lg"
          >
            {showSidebar ? 'Hide' : 'Show'} Lessons
          </button>
        </div>
        <div className="w-full bg-white/10 h-1">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-purple to-accent-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            showSidebar ? 'block' : 'hidden'
          } md:block w-full md:w-80 lg:w-96 bg-black/50 border-r border-white/10 overflow-y-auto`}
        >
          <div className="p-6 space-y-6">
            {modules.map((module) => (
              <div key={module.id} className="space-y-2">
                <h3 className="font-semibold text-white/90">{module.title}</h3>
                {module.description && (
                  <p className="text-sm text-white/50">{module.description}</p>
                )}
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const completed = isLessonCompleted(lesson.id);
                    const isCurrent = currentLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          isCurrent
                            ? 'bg-white/20 border border-accent-gold'
                            : completed
                            ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{lesson.title}</p>
                            {lesson.duration && (
                              <p className="text-xs text-white/50 mt-1">{lesson.duration}</p>
                            )}
                          </div>
                          {completed && (
                            <svg
                              className="w-5 h-5 text-green-400 flex-shrink-0 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">{currentLesson.title}</h2>
                {currentLesson.duration && (
                  <p className="text-white/50">Duration: {currentLesson.duration}</p>
                )}
              </div>

              {currentLesson.videoUrl && (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                  <ReactPlayer
                    {...{ url: currentLesson.videoUrl }}
                    width="100%"
                    height="100%"
                    controls={true}
                    // Only add config prop if it's a YouTube URL
                    {...(
                      currentLesson.videoUrl?.includes('youtube.com') || currentLesson.videoUrl?.includes('youtu.be')
                        ? { config: { youtube: { playerVars: { modestbranding: 1 } } } as any }
                        : {}
                    )}
                  />
                </div>
              )}

              {currentLesson.content && (
                <div className="glass rounded-2xl p-8">
                  <h3 className="font-semibold text-lg mb-4">Lesson Notes</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/70 whitespace-pre-wrap">{currentLesson.content}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {!isLessonCompleted(currentLesson.id) && (
                  <button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
                  >
                    Mark as Complete
                  </button>
                )}
                {isLessonCompleted(currentLesson.id) && (
                  <div className="px-8 py-4 bg-green-500/20 border border-green-500/30 text-green-400 font-semibold rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50">Select a lesson to start learning</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
