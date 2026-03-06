import { NextResponse } from 'next/server'
import { usingPostgres } from 'lib/prisma'

// Lightweight debug endpoint to verify whether the deployed runtime is
// using Postgres and whether it can reach the database. This intentionally
// does not return secrets or the full connection string — only a boolean
// status and an optional error message to aid diagnosis.
export async function GET() {
  const using = Boolean(usingPostgres)
  let dbReachable = false
  let error: string | undefined

  if (using) {
    try {
      const { Pool } = await import('pg')
      const pool = new Pool({ connectionString: process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL })
      const res = await pool.query('SELECT 1')
      await pool.end()
      if (res && res.rows) dbReachable = true
    } catch (err: any) {
      error = String(err?.message ?? err)
    }
  }

  return NextResponse.json({ usingPostgres: using, dbReachable, error })
}
