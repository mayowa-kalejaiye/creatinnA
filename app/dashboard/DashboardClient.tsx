'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  enrollments: any[];
  certificates: any[];
}

export default function DashboardClient({ user, enrollments, certificates }: DashboardClientProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-display font-bold gradient-text">
            CreatINN Academy
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-white/70 hidden md:block">{user.name}</span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-accent-gold text-black font-bold flex items-center justify-center"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-lg border border-white/10 py-2">
                  <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-white/5">
                    Profile
                  </Link>
                  <Link href="/dashboard/certificates" className="block px-4 py-2 hover:bg-white/5">
                    Certificates
                  </Link>
                  <Link href="/" className="block px-4 py-2 hover:bg-white/5">
                    Back to Site
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 hover:bg-white/5 text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-white/60">
            Continue your learning journey
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {enrollments.length}
            </div>
            <div className="text-white/60">Enrolled Courses</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {enrollments.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-white/60">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {certificates.length}
            </div>
            <div className="text-white/60">Certificates</div>
          </motion.div>
        </div>

        {/* My Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">My Courses</h2>
            <Link href="/courses" className="text-accent-gold hover:underline">
              Browse All Courses
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-white/60 mb-6">You haven&apos;t enrolled in any courses yet</p>
              <Link 
                href="/courses"
                className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all group"
                >
                  {enrollment.course.thumbnail && (
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-black relative overflow-hidden">
                      <img 
                        src={enrollment.course.thumbnail} 
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold mb-2 group-hover:text-accent-gold transition-colors">
                      {enrollment.course.title}
                    </h3>
                    
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {enrollment.course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-accent-gold rounded-full h-2 transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/course/${enrollment.course.slug}`}
                      className="block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-center font-semibold transition-all"
                    >
                      {enrollment.progress === 0 ? 'Start Course' : 'Continue Learning'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">My Certificates</h2>
              <Link href="/dashboard/certificates" className="text-accent-gold hover:underline">
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.slice(0, 3).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 border-2 border-accent-gold/30"
                >
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="font-display font-bold mb-2">{cert.courseTitle}</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Issued {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-center text-sm font-semibold transition-all"
                    >
                      Download
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
