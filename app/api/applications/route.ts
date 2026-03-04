import { NextResponse } from "next/server"
import { sqlite } from "../../../lib/prisma"
import { notifyAdminNewApplication } from "../../../lib/mail"

// ---------- GET: list applications (admin) ----------
export async function GET() {
  try {
    const rows = sqlite
      .prepare(
        `SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone
         FROM "applications" a
         LEFT JOIN "users" u ON u.id = a.userId
         ORDER BY a.submittedAt DESC`
      )
      .all();
    const normalized = (rows as any[]).map((a: any) => ({
      ...a,
      user: { name: a.userName, email: a.userEmail, phone: a.userPhone },
    }));
    return NextResponse.json(normalized);
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
    let userRow: any = sqlite.prepare('SELECT id FROM "users" WHERE email = ?').get(email);
    if (!userRow) {
      const uid = (globalThis as any).crypto?.randomUUID?.() ?? Date.now().toString();
      const now = new Date().toISOString();
      sqlite.prepare(
        `INSERT INTO "users" (id, name, email, password, phone, role, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(uid, name, email, '__applicant__', phone ?? null, 'STUDENT', now, now);
      userRow = { id: uid };
    }

    const id = (globalThis as any).crypto?.randomUUID?.() ?? Date.now().toString()
    sqlite.prepare(
      `INSERT INTO "applications" (id, userId, program, status, experience, motivation, commitment, submittedAt, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, userRow.id, program, 'pending', experience, motivation, commitment ? 1 : 0, new Date().toISOString(), body.notes ?? null);

    // Notify admin via email (fire-and-forget — don't block the response)
    notifyAdminNewApplication({ name, email, phone, program, experience, motivation }).catch(() => {});

    return NextResponse.json({ success: true, id }, { status: 201 })
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

    const sets: string[] = ['status = ?'];
    const vals: any[] = [status];
    if (notes !== undefined) {
      sets.push('notes = ?');
      vals.push(notes);
    }
    vals.push(id);
    sqlite.prepare(`UPDATE "applications" SET ${sets.join(', ')} WHERE id = ?`).run(...vals);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
