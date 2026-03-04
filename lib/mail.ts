import nodemailer from 'nodemailer';

/**
 * Lightweight mailer for admin notifications.
 *
 * Required env vars (add to .env):
 *   SMTP_HOST=smtp.gmail.com          (or your SMTP provider)
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password       (Gmail: use an App Password, not your real password)
 *   ADMIN_EMAIL=admin@creatinn.com    (where notifications are sent)
 *
 * If SMTP_HOST is not set, emails are silently skipped so the app still works in dev.
 */

const isConfigured = !!process.env.SMTP_HOST;

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function notifyAdminNewApplication(application: {
  name: string;
  email: string;
  phone?: string;
  program: string;
  experience: string;
  motivation: string;
}) {
  if (!transporter) {
    console.log('[mail] SMTP not configured — skipping admin notification email');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER;
  if (!adminEmail) return;

  const programNames: Record<string, string> = {
    intensive: '2-Week Video Editing Intensive (₦100,000)',
    mastery: '1-on-1 Mastery Track (₦600,000)',
    online: 'Online Video Editing Course (₦30,000)',
  };

  const programLabel = programNames[application.program] ?? application.program;

  try {
    await transporter.sendMail({
      from: `"CreatINN Academy" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Application: ${application.name} — ${programLabel}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Application Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 130px;">Name</td><td style="padding: 8px 0;"><strong>${application.name}</strong></td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${application.email}</td></tr>
            ${application.phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${application.phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #888;">Program</td><td style="padding: 8px 0;">${programLabel}</td></tr>
          </table>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 13px; margin-bottom: 4px;">Creative Experience</p>
          <p style="white-space: pre-wrap;">${application.experience}</p>
          <p style="color: #888; font-size: 13px; margin-bottom: 4px;">Motivation</p>
          <p style="white-space: pre-wrap;">${application.motivation}</p>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/admin" style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Review in Admin Dashboard
            </a>
          </p>
        </div>
      `,
    });
    console.log('[mail] Admin notification sent for application from', application.email);
  } catch (err) {
    console.error('[mail] Failed to send admin notification:', err);
  }
}

export async function notifyAdminNewSubscription(email: string) {
  if (!transporter) {
    console.log('[mail] SMTP not configured — skipping subscription notification email');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER;
  if (!adminEmail) return;

  try {
    await transporter.sendMail({
      from: `"CreatINN Academy" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Thinkinn Subscription: ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Thinkinn Subscription</h2>
          <p style="color: #555;">A user subscribed to The Thinkinn notifications.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <tr><td style="padding: 8px 0; color: #888; width: 130px;">Email</td><td style="padding: 8px 0;"></td></tr>
            <tr><td style="padding: 8px 0;">${email}</td><td></td></tr>
          </table>
          <p style="color: #888; font-size: 12px; margin-top: 12px;">Subscribed at: ${new Date().toISOString()}</p>
        </div>
      `,
    });
    console.log('[mail] Admin notification sent for subscription', email);
  } catch (err) {
    console.error('[mail] Failed to send subscription notification:', err);
  }
}
