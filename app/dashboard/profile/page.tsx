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
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-6">Profile</h1>

      <div className="glass rounded-2xl p-6 space-y-3">
        <p className="text-white/80"><strong>Name:</strong> {user.name ?? '—'}</p>
        <p className="text-white/80"><strong>Email:</strong> {user.email ?? '—'}</p>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
