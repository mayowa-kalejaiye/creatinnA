"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const search = useSearchParams();
  const paymentId = search.get('paymentId');

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-12 text-center max-w-xl">
        <h1 className="text-3xl font-display font-bold mb-4">Payment Successful</h1>
        <p className="text-white/70 mb-6">Thank you. Your payment id: <strong>{paymentId}</strong></p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
