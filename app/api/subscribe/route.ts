import { NextResponse } from 'next/server'
import { notifyAdminNewSubscription } from '../../../lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body?.email || '').toString().trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Fire-and-forget admin notification via SMTP
    notifyAdminNewSubscription(email).catch(() => {})

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
