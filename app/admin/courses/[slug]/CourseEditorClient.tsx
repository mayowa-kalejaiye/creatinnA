'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Lesson = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  duration: string | null;
  order: number;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
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
  thumbnail: string | null;
  isPublished: boolean;
  modules: Module[];
};

export default function CourseEditorClient({ course }: { course: Course }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');
  const [courseData, setCourseData] = useState(course);
  const [saving, setSaving] = useState(false);

  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' });
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  const updateCourse = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          duration: courseData.duration,
          level: courseData.level,
          category: courseData.category,
          thumbnail: courseData.thumbnail,
          isPublished: courseData.isPublished
        })
      });

      if (res.ok) {
        alert('Course updated successfully');
      }
    } catch (error) {
      alert('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const addModule = async () => {
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newModule,
          order: courseData.modules.length
        })
      });

      if (res.ok) {
        const module = await res.json();
        setCourseData({
          ...courseData,
          modules: [...courseData.modules, { ...module, lessons: [] }]
        });
        setNewModule({ title: '', description: '' });
        setShowModuleForm(false);
      }
    } catch (error) {
      alert('Failed to add module');
    }
  };

  const addLesson = async () => {
    try {
      const res = await fetch(`/api/modules/${newLesson.moduleId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLesson.title,
          videoUrl: newLesson.videoUrl,
          duration: newLesson.duration,
          content: newLesson.content,
          order: courseData.modules.find(m => m.id === newLesson.moduleId)?.lessons.length || 0
        })
      });

      if (res.ok) {
        const lesson = await res.json();
        setCourseData({
          ...courseData,
          modules: courseData.modules.map(m =>
            m.id === newLesson.moduleId
              ? { ...m, lessons: [...m.lessons, lesson] }
              : m
          )
        });
        setNewLesson({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' });
        setShowLessonForm(false);
      }
    } catch (error) {
      alert('Failed to add lesson');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/admin" className="text-white/70 hover:text-white text-sm mb-2 inline-block">
                ← Back to Admin
              </Link>
              <h1 className="text-2xl font-display font-bold gradient-text">{course.title}</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCourseData({ ...courseData, isPublished: !courseData.isPublished })}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  courseData.isPublished
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 text-white/70 border border-white/10'
                }`}
              >
                {courseData.isPublished ? 'Published' : 'Draft'}
              </button>
              <button
                onClick={updateCourse}
                disabled={saving}
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-2 font-medium transition-all ${
                activeTab === 'details'
                  ? 'border-b-2 border-accent-gold text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-3 px-2 font-medium transition-all ${
                activeTab === 'content'
                  ? 'border-b-2 border-accent-gold text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Course Content
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'details' && (
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={courseData.thumbnail || ''}
                  onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₦)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={courseData.price}
                  onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={courseData.duration}
                  onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={courseData.level}
                  onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                value={courseData.category}
                onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              >
                <option value="Video Editing">Video Editing</option>
                <option value="Business">Business</option>
                <option value="AI & Technology">AI & Technology</option>
                <option value="Creative Skills">Creative Skills</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-bold">Course Modules & Lessons</h2>
              <button
                onClick={() => setShowModuleForm(!showModuleForm)}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
              >
                + Add Module
              </button>
            </div>

            {showModuleForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 space-y-4"
              >
                <h3 className="font-semibold text-lg">New Module</h3>
                <input
                  type="text"
                  placeholder="Module Title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                />
                <textarea
                  placeholder="Module Description"
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                />
                <div className="flex gap-3">
                  <button
                    onClick={addModule}
                    className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
                  >
                    Add Module
                  </button>
                  <button
                    onClick={() => setShowModuleForm(false)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {courseData.modules.map((module, idx) => (
              <div key={module.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Module {idx + 1}: {module.title}</h3>
                    {module.description && <p className="text-white/60 text-sm mt-1">{module.description}</p>}
                    <p className="text-white/40 text-sm mt-2">{module.lessons.length} lessons</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewLesson({ ...newLesson, moduleId: module.id });
                      setShowLessonForm(true);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all"
                  >
                    + Add Lesson
                  </button>
                </div>

                {module.lessons.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {module.lessons.map((lesson, lessonIdx) => (
                      <div key={lesson.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Lesson {lessonIdx + 1}: {lesson.title}</p>
                            {lesson.duration && <p className="text-white/50 text-sm mt-1">Duration: {lesson.duration}</p>}
                            {lesson.videoUrl && (
                              <p className="text-accent-gold text-sm mt-1 truncate max-w-md">
                                Video: {lesson.videoUrl}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {showLessonForm && newLesson.moduleId && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 space-y-4"
              >
                <h3 className="font-semibold text-lg">New Lesson</h3>
                <input
                  type="text"
                  placeholder="Lesson Title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Video URL (YouTube, Vimeo, etc.)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 15 minutes)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
                <textarea
                  placeholder="Lesson Content (optional)"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                />
                <div className="flex gap-3">
                  <button
                    onClick={addLesson}
                    className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
                  >
                    Add Lesson
                  </button>
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      setNewLesson({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' });
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {courseData.modules.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-white/50">No modules yet. Add your first module to get started.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
