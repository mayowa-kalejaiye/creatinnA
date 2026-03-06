import { NextResponse } from 'next/server';
import { getPaymentById, updatePaymentStatus, createEnrollment, getEnrollmentByUserCourse } from '@/lib/db-adapter';
import Paystack from 'paystack-node';
import crypto from 'crypto';

type PaymentData = {
  reference?: string
  tx_ref?: string
  transaction_reference?: string
  metadata?: Record<string, unknown>
  id?: string
  transaction?: string
}

const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
const paystack = paystackSecret ? new Paystack(paystackSecret) : null;

// Using db-adapter helpers for payments and enrollments (pg preferred)

export async function POST(req: Request) {
  try {
    // If webhook secret is not configured, reject - payments are disabled
    if (!paystackSecret) {
      return NextResponse.json({ error: 'payments disabled' }, { status: 410 });
    }

    // Verify Paystack webhook signature
    let event: any = null;
    const buf = Buffer.from(await req.arrayBuffer());
    const sig = (req.headers.get('x-paystack-signature') || '').toString();
    const hash = crypto.createHmac('sha512', paystackSecret).update(buf).digest('hex');
    if (!sig || hash !== sig) {
      console.warn('Paystack webhook signature verification failed');
      return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
    }
    try {
      event = JSON.parse(buf.toString());
    } catch (e) {
      console.warn('Failed to parse webhook payload');
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }

    const eventType = event?.event || event?.type || '';

    // Normalize handler for Paystack charge success
    if (eventType === 'charge.success' || eventType === 'charge.success' /* explicit */) {
      const data = (event.data || {}) as PaymentData;
      const reference = data.reference || data.tx_ref || data.transaction_reference;
      const metadata = (data.metadata || {}) as Record<string, unknown>;

      if (!reference) {
        console.warn('Webhook missing reference id');
        return NextResponse.json({ error: 'missing reference' }, { status: 400 });
      }

      // Require an existing payment row - do not auto-create payments from webhooks
      const existing = await getPaymentById(reference) as Record<string, unknown> | null;
      if (!existing) {
        console.warn('Payment row not found for reference; ignoring webhook', reference);
        return NextResponse.json({ ok: true });
      }

      // Idempotent update: only update if not already completed
      if (String((existing as any).status).toLowerCase() !== 'completed') {
        const providerId = data.id ?? data.transaction ?? undefined;
        const updated = await updatePaymentStatus(reference, 'completed', providerId);
        if (!updated) console.warn('Failed to update payment status for', reference);
      }

      // Enrollment logic - only proceed if metadata and payment row provide required info
      const getFirst = (obj: Record<string, unknown> | null, ...keys: string[]) => {
        if (!obj) return null
        for (const k of keys) {
          const v = obj[k]
          if (v !== undefined && v !== null) return String(v)
        }
        return null
      }

      const userId = getFirst(metadata, 'userId', 'user_id', 'user') || getFirst(existing, 'userId', 'user_id', 'user');
      const courseId = getFirst(metadata, 'courseId', 'course_id', 'course') || getFirst(existing, 'courseId', 'course_id', 'course');
      const program = (metadata['program'] as string) || (existing && (existing['program'] as string)) || '';
      const isSelective = typeof program === 'string' && !program.toLowerCase().includes('online');
      const enrollmentStatus = isSelective ? 'pending' : 'active';

      if (!userId || !courseId) {
        console.warn('Missing userId or courseId in webhook metadata or payment row; skipping enrollment');
        return NextResponse.json({ ok: true });
      }

      // check if enrollment exists (case-insensitive table names)
      const existingEnrollment = await getEnrollmentByUserCourse(userId, courseId)
      if (!existingEnrollment) {
        try {
          await createEnrollment({ userId, courseId })
        } catch (e) {
          console.error('Failed to create enrollment for', userId, courseId, e);
          if (isSelective) console.error(`ADMIN ACTION REQUIRED: Review enrollment for user ${userId}, course ${courseId} - payment completed but enrollment failed`);
        }
      }

    } else if (eventType === 'manual' || event?.type === 'manual') {
      // Allow manual test payloads only when authenticated via secret - but in production this block will rarely be used.
      const paymentId = event.paymentId || event.payment_id;
      const providerStatus = (event.providerStatus || event.provider_status || 'success').toString();
      if (!paymentId) return NextResponse.json({ error: 'missing paymentId' }, { status: 400 });

      // Require existing payment row
      const paymentRow = await getPaymentById(paymentId) as { userId?: string; courseId?: string; program?: string } | null;
      if (!paymentRow) {
        console.warn('Manual webhook: payment row not found', paymentId);
        return NextResponse.json({ ok: true });
      }

      // Update payment status (idempotent)
      await updatePaymentStatus(paymentId, providerStatus);

      // attempt enrollment when provider indicates success/completed
      if (['success', 'completed', 'paid', 'ok'].includes(providerStatus.toLowerCase())) {
        try {
          if (paymentRow && paymentRow.userId && paymentRow.courseId) {
            try {
              await createEnrollment({ userId: paymentRow.userId as string, courseId: paymentRow.courseId as string })
            } catch (e) {
              console.error('Manual webhook enrollment error', e)
            }
          } else {
            console.warn('Manual webhook: payment row missing userId/courseId', paymentId);
          }
        } catch (e) {
          console.error('Manual webhook enrollment error', e);
        }
      }
    } else {
      console.warn('Unhandled webhook event type');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'webhook failed' }, { status: 500 });
  }
}

