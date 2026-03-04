import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CertificatesPage() {
  const session = await auth();
  type User = { id: string; name?: string; email?: string; role?: string };
  const user = (session && (session as any).user) as User | undefined;
  if (!user) {
    redirect('/login');
    return null;
  }

  // Certificates feature not implemented yet; render empty state.
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Dashboard
          </Link>
          <div className="h-5 w-px bg-white/[0.08]" />
          <span className="text-sm font-medium">Certificates</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Certificates</h1>
          <p className="text-xs text-white/30 mt-1">Your earned achievements and credentials</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-[1px]">
            <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
          </div>
          <div className="relative z-10 py-20 px-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent-gold/10 border border-accent-gold/15 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-display font-bold mb-2">No certificates yet</h3>
            <p className="text-white/35 text-sm mb-6 max-w-sm mx-auto">
              Complete a course to earn your certificate. Certificates will appear here once issued.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-accent-gold transition-all"
            >
              Browse Courses
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
