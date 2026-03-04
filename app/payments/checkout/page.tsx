'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();

  const [program, setProgram] = useState('');

  useEffect(() => {
    // Payments are handled offline — redirect to the application page
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const p = params ? params.get('program') || '' : '';
    setProgram(p);
    router.replace(`/apply${p ? `?program=${encodeURIComponent(p)}` : ''}`);
  }, [router]);

  return (
    <div className="min-h-screen">
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto glass rounded-2xl p-12 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Payments Are Handled Directly</h1>
          <p className="text-white/60 mb-6">
            To enroll in a program, submit an application first. Once accepted, payment details will be arranged directly with the academy.
          </p>
          <a
            href={`/apply${program ? `?program=${encodeURIComponent(program)}` : ''}`}
            className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
          >
            Apply Now
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
