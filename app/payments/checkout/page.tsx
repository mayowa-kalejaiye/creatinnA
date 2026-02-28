'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const search = useSearchParams();
  const program = search.get('program') || 'Unknown Program';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program })
      });
      const data = await res.json();
      if (res.ok && data?.checkoutUrl) {
        // Redirect to provider or success stub
        window.location.href = data.checkoutUrl;
      } else {
        setError(data?.error || 'Failed to create payment');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass rounded-3xl p-12 text-center">
            <h1 className="text-3xl font-display font-bold mb-4">Checkout</h1>
            <p className="text-white/70 mb-6">You&apos;re about to pay for: <strong>{program}</strong></p>

            <button
              onClick={handlePay}
              disabled={loading}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all"
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
