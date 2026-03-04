'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* -- Icons -- */
function IconArrow() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>; }
function IconPlus() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>; }
function IconTrash() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>; }
function IconPlay() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>; }
function IconChevron() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>; }
function IconSettings() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function IconBook() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>; }
function IconPencil() { return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>; }

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
  const [view, setView] = useState<'content' | 'settings'>('content');
  const [courseData, setCourseData] = useState(course);
  const [saving, setSaving] = useState(false);

  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' });
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [activeLessonForm, setActiveLessonForm] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lessonId: string; title: string; videoUrl: string; duration: string; content: string } | null>(null);
  const [editLessonSaving, setEditLessonSaving] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(course.modules.map(m => m.id)));

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
          isPublished: courseData.isPublished,
          meta: {
            prerequisites: (courseData as any).prerequisites || '',
            outcomes: (courseData as any).outcomes || '',
            summary: (courseData as any).summary || ''
          }
        })
      });
      if (res.ok) alert('Course updated successfully');
      else alert('Failed to update course');
    } catch { alert('Failed to update course'); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    try {
      const desc = (course as any).description;
      if (desc && typeof desc === 'string') {
        const parsed = JSON.parse(desc);
        if (parsed && typeof parsed === 'object' && ('meta' in parsed)) {
          setCourseData((cd) => ({
            ...cd,
            description: parsed.long || '',
            prerequisites: parsed.meta.prerequisites || '',
            outcomes: parsed.meta.outcomes || '',
            summary: parsed.meta.summary || ''
          } as any));
        }
      }
    } catch {}
  }, [course]);

  const uploadThumbnail = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch('/api/uploads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, data: reader.result as string })
        });
        if (res.ok) {
          const json = await res.json();
          setCourseData((cd) => ({ ...cd, thumbnail: json.url } as any));
        } else alert('Upload failed');
      };
      reader.readAsDataURL(file);
    } catch { alert('Upload error'); }
  };

  const addModule = async () => {
    if (!newModule.title.trim()) return;
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newModule, order: courseData.modules.length })
      });
      if (res.ok) {
        const moduleData = await res.json();
        if (moduleData.order === undefined && moduleData.position !== undefined) moduleData.order = moduleData.position;
        const newMod = { ...moduleData, lessons: [] };
        setCourseData(cd => ({ ...cd, modules: [...cd.modules, newMod] }));
        setExpandedModules(prev => new Set([...prev, newMod.id]));
        setNewModule({ title: '', description: '' });
        setShowModuleForm(false);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to add module: ${err.error || res.statusText}`);
      }
    } catch { alert('Failed to add module'); }
  };

  const addLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.moduleId) return;
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
        setCourseData(cd => ({
          ...cd,
          modules: cd.modules.map(m => m.id === newLesson.moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)
        }));
        setNewLesson({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' });
        setActiveLessonForm(null);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to add lesson: ${err.error || res.statusText}`);
      }
    } catch { alert('Failed to add lesson'); }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}`, { method: 'DELETE' });
      if (res.ok) setCourseData(cd => ({ ...cd, modules: cd.modules.filter(m => m.id !== moduleId) } as any));
      else alert('Failed to delete module');
    } catch { alert('Failed to delete module'); }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, { method: 'DELETE' });
      if (res.ok) {
        setCourseData(cd => ({
          ...cd,
          modules: cd.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m)
        } as any));
      } else alert('Failed to delete lesson');
    } catch { alert('Failed to delete lesson'); }
  };

  const startEditLesson = (moduleId: string, lesson: Lesson) => {
    setEditingLesson({
      moduleId,
      lessonId: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || '',
      content: lesson.content || '',
    });
  };

  const updateLesson = async () => {
    if (!editingLesson || !editingLesson.title.trim()) return;
    setEditLessonSaving(true);
    try {
      const res = await fetch(`/api/modules/${editingLesson.moduleId}/lessons/${editingLesson.lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingLesson.title,
          videoUrl: editingLesson.videoUrl,
          duration: editingLesson.duration,
          content: editingLesson.content,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCourseData(cd => ({
          ...cd,
          modules: cd.modules.map(m =>
            m.id === editingLesson.moduleId
              ? { ...m, lessons: m.lessons.map(l => l.id === editingLesson.lessonId ? { ...l, title: updated.title ?? editingLesson.title, content: updated.content ?? null, videoUrl: updated.videoUrl ?? null, duration: updated.duration ?? null } : l) }
              : m
          ),
        }));
        setEditingLesson(null);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to update lesson: ${err.error || res.statusText}`);
      }
    } catch { alert('Failed to update lesson'); }
    setEditLessonSaving(false);
  };

  const totalLessons = courseData.modules.reduce((a, m) => a + m.lessons.length, 0);

  const inputCls = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors";

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) router.back();
                else router.push('/admin/courses');
              }}
              className="p-2 -ml-2 hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <IconArrow />
            </button>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sm truncate">{courseData.title}</h1>
              <p className="text-[11px] text-white/30">{courseData.modules.length} modules &middot; {totalLessons} lessons</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCourseData(cd => ({ ...cd, isPublished: !cd.isPublished }))}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                courseData.isPublished
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {courseData.isPublished ? 'Live' : 'Draft'}
            </button>
            <button
              onClick={updateCourse}
              disabled={saving}
              className="px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all disabled:opacity-50"
            >
              {saving ? 'Saving\u2026' : 'Save'}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 flex gap-1 -mb-px">
          <button
            onClick={() => setView('content')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
              view === 'content' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            <IconBook /> Course Builder
          </button>
          <button
            onClick={() => setView('settings')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
              view === 'settings' ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            <IconSettings /> Course Settings
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* COURSE BUILDER */}
        {view === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold">Modules & Lessons</h2>
                <p className="text-xs text-white/30 mt-0.5">Build your course curriculum below</p>
              </div>
              <button
                onClick={() => setShowModuleForm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all"
              >
                <IconPlus /> Add Module
              </button>
            </div>

            <AnimatePresence>
              {showModuleForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold">New Module</h3>
                    <input
                      type="text"
                      placeholder="Module title (e.g., Introduction to Editing)"
                      className={inputCls}
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                      autoFocus
                    />
                    <textarea
                      placeholder="Brief description (optional)"
                      rows={2}
                      className={inputCls + ' resize-none'}
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <button onClick={addModule} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all">
                        Create Module
                      </button>
                      <button onClick={() => { setShowModuleForm(false); setNewModule({ title: '', description: '' }); }} className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-xs rounded-xl transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {courseData.modules.length === 0 && !showModuleForm && (
              <div className="text-center py-24 bg-white/[0.02] border border-dashed border-white/[0.08] rounded-2xl">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
                  <IconBook />
                </div>
                <p className="text-white/40 text-sm mb-1">No modules yet</p>
                <p className="text-white/20 text-xs mb-5">Start building your course by adding the first module</p>
                <button
                  onClick={() => setShowModuleForm(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all"
                >
                  <IconPlus /> Add First Module
                </button>
              </div>
            )}

            <div className="space-y-3">
              {courseData.modules.map((mod, idx) => {
                const isExpanded = expandedModules.has(mod.id);
                const isLessonFormOpen = activeLessonForm === mod.id;

                return (
                  <div key={mod.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.10] transition-all">
                    <div className="flex items-center gap-3 px-5 py-4">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className={`p-1 rounded-lg hover:bg-white/[0.06] transition-all ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                      >
                        <IconChevron />
                      </button>

                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleModule(mod.id)}>
                        <div className="flex items-center gap-2.5">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white/40">
                            {idx + 1}
                          </span>
                          <h3 className="font-semibold text-sm truncate">{mod.title}</h3>
                        </div>
                        {mod.description && <p className="text-xs text-white/30 mt-1 ml-[34px] truncate">{mod.description}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-white/20">{mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}</span>
                        <button
                          onClick={() => { setNewLesson({ moduleId: mod.id, title: '', videoUrl: '', duration: '', content: '' }); setActiveLessonForm(mod.id); if (!isExpanded) toggleModule(mod.id); }}
                          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-all"
                          title="Add lesson"
                        >
                          <IconPlus />
                        </button>
                        <button
                          onClick={() => deleteModule(mod.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                          title="Delete module"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.04]">
                            {mod.lessons.length > 0 && (
                              <div>
                                {mod.lessons.map((lesson, lessonIdx) => {
                                  const isEditing = editingLesson?.lessonId === lesson.id && editingLesson?.moduleId === mod.id;
                                  return isEditing ? (
                                    <div key={lesson.id} className="bg-white/[0.03] border-b border-white/[0.04] px-6 py-4 ml-5 space-y-3">
                                      <h4 className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider flex items-center gap-2"><IconPencil /> Editing Lesson</h4>
                                      <input
                                        type="text"
                                        placeholder="Lesson title"
                                        className={inputCls}
                                        value={editingLesson.title}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                        autoFocus
                                      />
                                      <div className="grid sm:grid-cols-2 gap-3">
                                        <input
                                          type="text"
                                          placeholder="Video URL (YouTube, Vimeo, etc.)"
                                          className={inputCls}
                                          value={editingLesson.videoUrl}
                                          onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                                        />
                                        <input
                                          type="text"
                                          placeholder="Duration (e.g., 15 minutes)"
                                          className={inputCls}
                                          value={editingLesson.duration}
                                          onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                                        />
                                      </div>
                                      <textarea
                                        placeholder="Lesson content / notes (optional)"
                                        rows={3}
                                        className={inputCls + ' resize-none'}
                                        value={editingLesson.content}
                                        onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                                      />
                                      <div className="flex gap-2">
                                        <button onClick={updateLesson} disabled={editLessonSaving} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all disabled:opacity-50">
                                          {editLessonSaving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                        <button
                                          onClick={() => setEditingLesson(null)}
                                          className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-xs rounded-xl transition-all"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-3 px-5 py-3 ml-5 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] group"
                                    >
                                      <div className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0">
                                        <IconPlay />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          {lesson.duration && <span className="text-[11px] text-white/25">{lesson.duration}</span>}
                                          {lesson.videoUrl && <span className="text-[11px] text-emerald-400/60 truncate max-w-[200px]">{lesson.videoUrl}</span>}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                          onClick={() => startEditLesson(mod.id, lesson)}
                                          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/20 hover:text-amber-400 transition-all"
                                          title="Edit lesson"
                                        >
                                          <IconPencil />
                                        </button>
                                        <button
                                          onClick={() => deleteLesson(mod.id, lesson.id)}
                                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                                          title="Delete lesson"
                                        >
                                          <IconTrash />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {mod.lessons.length === 0 && !isLessonFormOpen && (
                              <div className="px-5 py-8 text-center">
                                <p className="text-white/20 text-xs mb-3">No lessons in this module</p>
                                <button
                                  onClick={() => { setNewLesson({ moduleId: mod.id, title: '', videoUrl: '', duration: '', content: '' }); setActiveLessonForm(mod.id); }}
                                  className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
                                >
                                  <IconPlus /> Add a lesson
                                </button>
                              </div>
                            )}

                            <AnimatePresence>
                              {isLessonFormOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-white/[0.02] border-t border-white/[0.06] px-6 py-5 space-y-3">
                                    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">New Lesson</h4>
                                    <input
                                      type="text"
                                      placeholder="Lesson title"
                                      className={inputCls}
                                      value={newLesson.title}
                                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                      autoFocus
                                    />
                                    <div className="grid sm:grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        placeholder="Video URL (YouTube, Vimeo, etc.)"
                                        className={inputCls}
                                        value={newLesson.videoUrl}
                                        onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                      />
                                      <input
                                        type="text"
                                        placeholder="Duration (e.g., 15 minutes)"
                                        className={inputCls}
                                        value={newLesson.duration}
                                        onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                      />
                                    </div>
                                    <textarea
                                      placeholder="Lesson content / notes (optional)"
                                      rows={3}
                                      className={inputCls + ' resize-none'}
                                      value={newLesson.content}
                                      onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={addLesson} className="px-5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-accent-gold transition-all">
                                        Add Lesson
                                      </button>
                                      <button
                                        onClick={() => { setActiveLessonForm(null); setNewLesson({ moduleId: '', title: '', videoUrl: '', duration: '', content: '' }); }}
                                        className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-xs rounded-xl transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COURSE SETTINGS */}
        {view === 'settings' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-display font-bold mb-1">Course Settings</h2>
              <p className="text-xs text-white/30">Configure course metadata, pricing, and details</p>
            </div>

            <div className="space-y-6">
              <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h3>
                <div>
                  <label className="block text-xs text-white/30 mb-1.5">Course Title</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1.5">Thumbnail</label>
                  <div className="flex items-center gap-4">
                    {courseData.thumbnail && (
                      <img src={courseData.thumbnail} alt="" className="w-24 h-16 object-cover rounded-lg border border-white/[0.06]" />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadThumbnail(f); }}
                        className="text-xs text-white/40 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-white/[0.06] file:text-white/60 file:text-xs file:font-medium hover:file:bg-white/10 file:cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder="Or enter URL manually"
                        className={inputCls}
                        value={courseData.thumbnail || ''}
                        onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Description</h3>
                <div>
                  <label className="block text-xs text-white/30 mb-1.5">Full Description</label>
                  <textarea
                    rows={4}
                    className={inputCls + ' resize-none'}
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-1.5">Short Summary</label>
                  <textarea
                    rows={2}
                    className={inputCls + ' resize-none'}
                    value={(courseData as any).summary || ''}
                    onChange={(e) => setCourseData({ ...courseData, summary: e.target.value } as any)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Prerequisites</label>
                    <textarea
                      rows={3}
                      className={inputCls + ' resize-none'}
                      value={(courseData as any).prerequisites || ''}
                      onChange={(e) => setCourseData({ ...courseData, prerequisites: e.target.value } as any)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Learning Outcomes</label>
                    <textarea
                      rows={3}
                      className={inputCls + ' resize-none'}
                      value={(courseData as any).outcomes || ''}
                      onChange={(e) => setCourseData({ ...courseData, outcomes: e.target.value } as any)}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Pricing & Details</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Price (&#x20A6;)</label>
                    <input
                      type="number"
                      className={inputCls}
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Duration</label>
                    <input
                      type="text"
                      className={inputCls}
                      value={courseData.duration}
                      onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5">Level</label>
                    <select
                      className={inputCls}
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
                  <label className="block text-xs text-white/30 mb-1.5">Category</label>
                  <select
                    className={inputCls}
                    value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  >
                    <option value="Video Editing">Video Editing</option>
                    <option value="Business">Business</option>
                    <option value="AI & Technology">AI & Technology</option>
                    <option value="Creative Skills">Creative Skills</option>
                  </select>
                </div>
              </section>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
