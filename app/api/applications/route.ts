import { NextResponse } from "next/server"
import { db } from "../../../lib/prisma"
import { applications } from "../../../drizzle/schema"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, program, experience, motivation, commitment } = body
    if (!userId || !program || !experience || !motivation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const id = (globalThis as any).crypto?.randomUUID?.() ?? Date.now().toString()
    const record = {
      id,
      userId,
      program,
      status: "pending",
      experience,
      motivation,
      commitment: commitment ? 1 : 0,
      submittedAt: new Date().toISOString(),
      notes: body.notes ?? null,
    }

    await db.insert(applications).values(record).run()

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
