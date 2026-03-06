import { NextResponse } from "next/server"
import { notifyAdminNewApplication } from "../../../lib/mail"
import { getAllApplications, getUserByEmail, createUser, createApplication, updateApplicationStatus } from "../../../lib/db-adapter"

// ---------- GET: list applications (admin) ----------
export async function GET() {
  try {
    const rows = await getAllApplications()
    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------- POST: submit a new application ----------
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, program, experience, motivation, commitment } = body

    if (!name || !email || !program || !experience || !motivation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Look up or create a lightweight user record so the application links to a userId
    let user = await getUserByEmail(email)
    if (!user) {
      const created = await createUser({ name, email, password: '__applicant__', phone: phone ?? null, role: 'STUDENT' })
      user = created
    }

    const application = await createApplication({ userId: (user as any).id, program, experience, motivation, commitment: Boolean(commitment), notes: body.notes ?? null })

    // Notify admin via email (fire-and-forget — don't block the response)
    notifyAdminNewApplication({ name, email, phone, program, experience, motivation }).catch(() => {});

    return NextResponse.json({ success: true, id: (application as any)?.id ?? null }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ---------- PATCH: update application status (approve / reject / shortlist) ----------
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }
    const allowed = ['pending', 'shortlisted', 'accepted', 'activated', 'rejected'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: `status must be one of: ${allowed.join(', ')}` }, { status: 400 });
    }
    const ok = await updateApplicationStatus(id, status, notes)
    if (!ok) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
