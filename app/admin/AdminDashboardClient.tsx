'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface AdminDashboardClientProps {
  stats: {
    totalStudents: number;
    totalCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
  };
  recentEnrollments: any[];
  courses: any[];
  pendingApplications: any[];
}

export default function AdminDashboardClient({ 
  stats, 
  recentEnrollments, 
  courses,
  pendingApplications 
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold gradient-text">
              Admin Dashboard
            </h1>
            <p className="text-xs text-white/50">CreatINN Academy</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/70 hover:text-white text-sm">
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-6">
            {['overview', 'courses', 'students', 'applications', 'payments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-accent-gold text-white'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.totalStudents}
                </div>
                <div className="text-white/60 text-sm">Total Students</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.totalCourses}
                </div>
                <div className="text-white/60 text-sm">Total Courses</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stats.totalEnrollments}
                </div>
                <div className="text-white/60 text-sm">Total Enrollments</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  ₦{stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Total Revenue</div>
              </motion.div>
            </div>

            {/* Pending Applications */}
            {pendingApplications.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">
                    Pending Applications ({pendingApplications.length})
                  </h2>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="text-accent-gold hover:underline text-sm"
                  >
                    View All
                  </button>
                </div>

                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Student</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Program</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold">Submitted</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApplications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold">{app.user.name}</div>
                              <div className="text-sm text-white/50">{app.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 capitalize">{app.program}</td>
                          <td className="px-6 py-4 text-white/60 text-sm">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-accent-gold hover:underline text-sm">
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Recent Enrollments */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Recent Enrollments</h2>
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold">Student</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold">Course</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold">Progress</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{enrollment.user.name}</div>
                          <div className="text-sm text-white/50">{enrollment.user.email}</div>
                        </td>
                        <td className="px-6 py-4">{enrollment.course.title}</td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-accent-gold rounded-full h-2"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/60 text-sm">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'courses' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Manage Courses</h2>
              <Link
                href="/admin/courses/new"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
              >
                + Create Course
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display font-bold text-lg">{course.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.isPublished 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-white/50">Enrollments</div>
                      <div className="font-semibold">{course._count.enrollments}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Modules</div>
                      <div className="font-semibold">{course._count.modules}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-center text-sm font-semibold"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/course/${course.slug}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'students' && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">All Students</h2>
            <p className="text-white/60">Student management coming soon...</p>
          </section>
        )}

        {activeTab === 'applications' && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">Applications</h2>
            <p className="text-white/60">Application management coming soon...</p>
          </section>
        )}

        {activeTab === 'payments' && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">Payment History</h2>
            <p className="text-white/60">Payment tracking coming soon...</p>
          </section>
        )}
      </main>
    </div>
  );
}
