import { NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import Paystack from 'paystack-node';

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

    const getTableCols = (t: string) => {
      try { const rows = sqlite.prepare(`PRAGMA table_info("${t}")`).all(); return Array.isArray(rows) ? rows.map((r:any)=>r.name) : []; } catch(e){ return [] }
    }

    // Resolve courseId from slug or approximate title match
    let courseId: string | null = null;
    try {
      const bySlug = sqlite.prepare('SELECT id FROM "Course" WHERE slug = ?').get(program) as { id: string } | undefined;
      if (bySlug) courseId = bySlug.id;
    } catch (e) {}
    if (!courseId) {
      try {
        const byTitle = sqlite.prepare('SELECT id FROM "Course" WHERE title LIKE ? LIMIT 1').get(`%${program}%`) as { id: string } | undefined;
        if (byTitle) courseId = byTitle.id;
      } catch (e) {}
    }

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

    // Try insert into either capitalized or lowercase payments table
    const candidates = ['Payment','payments'];
    let inserted = false;
    for (const t of candidates) {
      const cols = getTableCols(t);
      if (!cols || cols.length === 0) continue;
      const pick:any[] = [];
      const vals:any[] = [];
      for (const k of Object.keys(data)) {
        if (cols.includes(k)) { pick.push(`"${k}"`); vals.push(data[k]); }
      }
      if (pick.length === 0) continue;
      const placeholders = vals.map(()=>'?').join(',');
      const sql = `INSERT INTO "${t}"(${pick.join(',')}) VALUES (${placeholders})`;
      sqlite.prepare(sql).run(...vals);
      inserted = true;
      break;
    }

    if (!inserted) {
      try {
        sqlite.prepare('INSERT INTO "payments" (id, userId, amount, currency, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)').run(id, session.user.id, data.amount, data.currency, data.status, now);
        inserted = true;
      } catch (e) {}
    }

    if (!inserted) {
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
