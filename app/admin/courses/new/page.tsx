'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NewCoursePage() {
  // Auth is enforced at the edge by middleware.ts — only ADMIN users reach this page.
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'Beginner',
    category: 'Video Editing'
  });

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [outcomes, setOutcomes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          thumbnail: thumbnailUrl,
          meta: { summary, prerequisites, outcomes }
        })
      });

      if (res.ok) {
        const course = await res.json();
        router.push(`/admin/courses/${course.slug}`);
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="glass border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold gradient-text">Create New Course</h1>
          <Link href="/admin" className="text-white/70 hover:text-white">
            Back to Admin
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Course Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Summary</label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prerequisites</label>
              <textarea
                rows={2}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Learning Outcomes</label>
              <textarea
                rows={2}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold resize-none"
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = async () => {
                  const res = await fetch('/api/uploads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: f.name, data: reader.result }) });
                  if (res.ok) {
                    const j = await res.json();
                    setThumbnailUrl(j.url);
                  }
                };
                reader.readAsDataURL(f);
              }}
            />
            {thumbnailUrl && (
              <Image src={thumbnailUrl} alt="thumb" width={192} height={112} className="mt-3 rounded object-cover" />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₦)</label>
              <input
                type="number"
                required
                min="0"
                step="100"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                required
                placeholder="e.g., 4 Weeks, Self-Paced"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Video Editing">Video Editing</option>
                <option value="Business">Business</option>
                <option value="AI & Technology">AI & Technology</option>
                <option value="Creative Skills">Creative Skills</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <Link
              href="/admin"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
