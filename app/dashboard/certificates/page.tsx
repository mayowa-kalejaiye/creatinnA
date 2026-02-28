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
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-6">Certificates</h1>

      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-white/60 mb-4">You don&apos;t have any certificates yet.</p>
        <p className="text-white/40 text-sm">Certificates will appear here once issued.</p>
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
