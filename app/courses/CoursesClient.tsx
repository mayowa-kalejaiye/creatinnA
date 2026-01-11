'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  duration: string;
  level: string;
  category: string;
  _count: {
    enrollments: number;
    modules: number;
  };
}

interface CoursesClientProps {
  courses: Course[];
  userEnrollments: string[];
  isLoggedIn: boolean;
}

export default function CoursesClient({ courses, userEnrollments, isLoggedIn }: CoursesClientProps) {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Available Courses
              </h1>
              <p className="text-xl text-white/70">
                Online learning for those who cannot attend our physical campus
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            {courses.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <p className="text-white/60 mb-4">No courses available yet</p>
                <p className="text-white/40 text-sm">Check back soon for new courses!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                  const isEnrolled = userEnrollments.includes(course.id);
                  
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all group"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-black relative">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            🎓
                          </div>
                        )}
                        
                        {isEnrolled && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full">
                            Enrolled
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                            {course.level}
                          </span>
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                            {course.category}
                          </span>
                        </div>

                        <h3 className="text-xl font-display font-bold mb-2 group-hover:text-accent-gold transition-colors">
                          {course.title}
                        </h3>
                        
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                          <span>{course.duration}</span>
                          <span>{course._count.modules} modules</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold gradient-text">
                            ₦{course.price.toLocaleString()}
                          </div>
                          
                          <Link
                            href={`/course/${course.slug}`}
                            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
                          >
                            {isEnrolled ? 'Continue' : 'View Course'}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
