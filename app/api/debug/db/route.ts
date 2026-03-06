import { NextResponse } from 'next/server'
import { usingPostgres } from '@/lib/prisma'

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
      let currentDb: string | undefined
      let currentUser: string | undefined
      try {
        const info = await pool.query("SELECT current_database() AS db, current_user AS user")
        if (info && info.rows && info.rows[0]) {
          currentDb = info.rows[0].db
          currentUser = info.rows[0].user
        }
      } catch (e) {
        // ignore info query failures; we still consider the pool reachable if SELECT 1 succeeded
      }
      await pool.end()
      if (res && res.rows) dbReachable = true
      return NextResponse.json({ usingPostgres: using, dbReachable, currentDatabase: currentDb, currentUser, error })
    } catch (err: any) {
      error = String(err?.message ?? err)
    }
  }

  return NextResponse.json({ usingPostgres: using, dbReachable, error })
}
