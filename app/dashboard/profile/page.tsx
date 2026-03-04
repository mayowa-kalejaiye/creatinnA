import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();
  type User = { id: string; name?: string; email?: string; role?: string };
  const user = (session && (session as any).user) as User | undefined;
  if (!user) {
    redirect('/login');
    return null;
  }

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
          <span className="text-sm font-medium">Profile</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">Your Profile</h1>
          <p className="text-xs text-white/30 mt-1">Account information</p>
        </div>

        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent p-[1px]">
            <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
          </div>
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-gold to-amber-600 flex items-center justify-center text-black text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div>
                <p className="text-lg font-display font-bold">{user.name ?? '—'}</p>
                <p className="text-sm text-white/35">{user.email ?? '—'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
                <div>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1">Full Name</p>
                  <p className="text-sm font-medium">{user.name ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
                <div>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1">Email Address</p>
                  <p className="text-sm font-medium">{user.email ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1">Role</p>
                  <p className="text-sm font-medium">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${
                      user.role === 'ADMIN'
                        ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20'
                        : 'bg-white/[0.06] text-white/50 border border-white/[0.08]'
                    }`}>
                      {user.role ?? 'Student'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
