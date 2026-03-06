import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Paystack from 'paystack-node';
import { createPayment } from '@/lib/db-adapter';

// Environment-driven Paystack instance
const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
const paystack = paystackSecret ? new Paystack(paystackSecret) : null;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const program = body.program ?? 'unknown';

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
    const now = new Date().toISOString();

    // Resolve courseId from slug or approximate title match via adapter
    let courseId: string | null = null;
    try {
      const byCourse = await (async () => {
        // try exact slug/title via adapter helper
        try {
          const c = await (await import('@/lib/db-adapter')).getCourseBySlug(program)
          return c && c.id ? c.id : null
        } catch (e) { return null }
      })()
      if (byCourse) courseId = byCourse
    } catch (e) {}

    // Simple amount heuristics used by seed data (amount in kobo)
    const amount = program.toLowerCase().includes('100') ? 100000 : program.toLowerCase().includes('600') ? 600000 : program.toLowerCase().includes('30') ? 30000 : 0;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid program or amount' }, { status: 400 });
    }

    const data = {
      id,
      userId: session.user.id,
      courseId,
      program,
      amount,
      currency: 'NGN',
      status: 'pending',
      provider: paystack ? 'paystack' : 'stub',
      providerId: null,
      createdAt: now,
    } as Record<string, any>;

    const created = await createPayment(data as any)
    if (!created) {
      console.error('Failed to persist payment record for', id);
      return NextResponse.json({ error: 'failed to create payment record' }, { status: 500 });
    }

    // Create Paystack transaction when configured
    if (paystack) {
      try {
        const transaction = await paystack.transaction.initialize({
          amount: Number(amount), // in kobo
          email: session.user.email || 'user@example.com',
          reference: id,
          callback_url: `${baseUrl}/payments/success?paymentId=${id}`,
          metadata: { paymentId: id, userId: session.user.id, courseId: courseId ?? '', program },
        });

        const checkoutUrl = transaction?.data?.authorization_url;
        if (!checkoutUrl) {
          console.error('Paystack initialize returned no authorization_url', transaction);
          return NextResponse.json({ error: 'payment provider error' }, { status: 502 });
        }

        return NextResponse.json({ checkoutUrl, paymentId: id });
      } catch (e) {
        console.error('Paystack initialization failed', e);
        return NextResponse.json({ error: 'payment provider error' }, { status: 502 });
      }
    }

    // Fallback for local testing
    const checkoutUrl = `/payments/success?paymentId=${id}`;
    return NextResponse.json({ checkoutUrl, paymentId: id });
  } catch (err) {
    console.error('Create payment error:', err);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
