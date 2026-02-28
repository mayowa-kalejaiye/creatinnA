import { NextResponse } from 'next/server';
import { sqlite } from '@/lib/prisma';
import Paystack from 'paystack-node';
import crypto from 'crypto';

const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
const paystack = paystackSecret ? new Paystack(paystackSecret) : null;

function trySelectPayment(id: string) {
  try { return sqlite.prepare('SELECT * FROM "payments" WHERE id = ?').get(id); } catch (e) {}
  try { return sqlite.prepare('SELECT * FROM "Payment" WHERE id = ?').get(id); } catch (e) {}
  return null;
}

function tryUpdatePaymentStatus(id: string, status: string, providerId?: string) {
  try {
    const stmt = sqlite.prepare('UPDATE "Payment" SET status = ?, providerId = ? WHERE id = ?');
    stmt.run(status, providerId ?? null, id);
    return true;
  } catch (e) {
    try {
      const stmt2 = sqlite.prepare('UPDATE "payments" SET status = ?, providerId = ? WHERE id = ?');
      stmt2.run(status, providerId ?? null, id);
      return true;
    } catch (e) {
      return false;
    }
  }
}

function tryInsertEnrollment(enrollmentId: string, userId: string, courseId: string, status: string, now: string) {
  try {
    sqlite.prepare('INSERT INTO "Enrollment" (id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(enrollmentId, userId, courseId, status, 0, now);
    return true;
  } catch (e) {
    try {
      sqlite.prepare('INSERT INTO "enrollments" (id, userId, courseId, status, progress, enrolledAt) VALUES (?, ?, ?, ?, ?, ?)')
        .run(enrollmentId, userId, courseId, status, 0, now);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export async function POST(req: Request) {
  try {
    // Verify Paystack webhook signature if configured
    let event: any = null;

    if (paystackSecret) {
      const buf = Buffer.from(await req.arrayBuffer());
      const sig = (req.headers.get('x-paystack-signature') || '').toString();
      const hash = crypto.createHmac('sha512', paystackSecret).update(buf).digest('hex');
      if (!sig || hash !== sig) {
        console.error('Paystack webhook signature verification failed', { expected: hash, got: sig });
        return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
      }
      try {
        event = JSON.parse(buf.toString());
      } catch (e) {
        console.error('Failed to parse webhook payload', e);
        return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
      }
    } else {
      // Fallback: parse JSON body (for manual testing)
      event = await req.json();
    }

    const eventType = event?.event || event?.type || '';

    // Normalize handler for Paystack charge success
    if (eventType === 'charge.success' || eventType === 'charge.success' /* explicit */) {
      const data = event.data || {};
      const reference = data.reference || data.tx_ref || data.transaction_reference;
      const metadata = data.metadata || {};

      if (!reference) {
        console.error('Webhook missing reference id', { data });
        return NextResponse.json({ error: 'missing reference' }, { status: 400 });
      }

      // Idempotent update: only update if not already completed
      const existing = trySelectPayment(reference);
      if (existing && String((existing as any).status).toLowerCase() === 'completed') {
        console.log('Payment already completed, ignoring webhook', reference);
      } else {
        const providerId = data.id ?? data.transaction ?? null;
        const updated = tryUpdatePaymentStatus(reference, 'completed', providerId);
        if (!updated) console.warn('Failed to update payment status for', reference);
      }

      // Enrollment logic
      const userId = metadata.userId || metadata.user_id || metadata.user || null;
      const courseId = metadata.courseId || metadata.course_id || metadata.course || null;
      const program = metadata.program || (existing && (existing as any).program) || '';
      const isSelective = typeof program === 'string' && !program.toLowerCase().includes('online');
      const enrollmentStatus = isSelective ? 'pending' : 'active';

      if (userId && courseId) {
        // check if enrollment exists (case-insensitive table names)
        let existingEnrollment = null;
        try { existingEnrollment = sqlite.prepare('SELECT id FROM "Enrollment" WHERE userId = ? AND courseId = ?').get(userId, courseId); } catch (e) { try { existingEnrollment = sqlite.prepare('SELECT id FROM "enrollments" WHERE userId = ? AND courseId = ?').get(userId, courseId); } catch (e) {} }

        if (!existingEnrollment) {
          const enrollmentId = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
          const now = new Date().toISOString();
          const ok = tryInsertEnrollment(enrollmentId, userId, courseId, enrollmentStatus, now);
          if (ok) console.log(`Enrollment created: ${enrollmentId} for user ${userId}, status: ${enrollmentStatus}`);
          else {
            console.error('Failed to create enrollment for', userId, courseId);
            if (isSelective) console.error(`ADMIN ACTION REQUIRED: Review enrollment for user ${userId}, course ${courseId} - payment completed but enrollment failed`);
          }
        } else {
          console.log(`Enrollment already exists for user ${userId}, course ${courseId}`);
        }
      } else {
        console.warn('Missing userId or courseId in webhook metadata; skipping enrollment');
      }

    } else if (eventType === 'manual' || event?.type === 'manual') {
      // manual test payload handling
      const paymentId = event.paymentId || event.payment_id;
      const providerStatus = (event.providerStatus || event.provider_status || 'success').toString();
      if (!paymentId) return NextResponse.json({ error: 'missing paymentId' }, { status: 400 });

      // Update payment status (idempotent)
      tryUpdatePaymentStatus(paymentId, providerStatus);

      // attempt enrollment when provider indicates success/completed
      if (['success', 'completed', 'paid', 'ok'].includes(providerStatus.toLowerCase())) {
        try {
          const paymentRow = trySelectPayment(paymentId) as { userId?: string; courseId?: string; program?: string } | null;
          if (paymentRow && paymentRow.userId && paymentRow.courseId) {
            const enrollmentId = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());
            const now = new Date().toISOString();
            tryInsertEnrollment(enrollmentId, paymentRow.userId, paymentRow.courseId, 'active', now);
          } else {
            console.warn('Manual webhook: payment row missing userId/courseId', paymentId);
          }
        } catch (e) {
          console.error('Manual webhook enrollment error', e);
        }
      }
    } else {
      console.log('Unhandled webhook event type:', eventType);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'webhook failed' }, { status: 500 });
  }
}

