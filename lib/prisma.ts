import Database from 'better-sqlite3'
import { drizzle as sqliteDrizzle } from 'drizzle-orm/better-sqlite3'
import { Pool } from 'pg'
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres'

// If a production-style DB url is present (Vercel envs, Supabase), prefer Postgres.
const PROD_DB_URL = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL

// Common exports (filled below depending on environment)
export let db: any = null
export let sqlite: any = null
export type DatabaseClient = any

if (PROD_DB_URL) {
  // Production: connect to Postgres via pg Pool and Drizzle node-postgres adapter
  const pool = new Pool({ connectionString: PROD_DB_URL })
  const pgDb = pgDrizzle(pool)
  db = pgDb
  sqlite = null

  if (process.env.NODE_ENV !== 'production') {
    ;(globalThis as any).pgPool = pool
    ;(globalThis as any).drizzleDb = pgDb
  }
} else {
  // Local dev fallback: use better-sqlite3 + drizzle for sqlite
  let sqlitePath = process.env.DATABASE_URL ?? './data/dev.db'
  if (sqlitePath.startsWith('file:')) sqlitePath = sqlitePath.slice('file:'.length)
  sqlitePath = sqlitePath.replace(/^"(.*)"$/, '$1') // Remove quotes if present

  // Lazily create the connection and handle native binding failures gracefully.
  function createConnectionSafe() {
    try {
      return new Database(sqlitePath)
    } catch (err) {
      // Log a helpful warning but do not throw so module import doesn't crash the runtime.
      // This is important for serverless environments where native bindings or
      // writable file-system access may be unavailable during certain build steps.
      // eslint-disable-next-line no-console
      console.error('better-sqlite3 failed to load native bindings (continuing without DB):', err)
      return null
    }
  }

  type SqliteInstance = ReturnType<typeof createConnectionSafe>
  type DrizzleDb = ReturnType<typeof sqliteDrizzle> | null

  const globalForDb = globalThis as unknown as {
    sqliteInstance: SqliteInstance | undefined
    drizzleDb: DrizzleDb | undefined
  }

  const sqliteInstance = globalForDb.sqliteInstance ?? createConnectionSafe()
  let drizzleDb: DrizzleDb = null
  if (sqliteInstance) {
    drizzleDb = globalForDb.drizzleDb ?? sqliteDrizzle(sqliteInstance)
  }

  // Provide a safe sqlite fallback when native bindings or the DB file are unavailable.
  // Many server-side pages call `sqlite.prepare(...).get()` during prerender; returning
  // a lightweight shim prevents runtime crashes in serverless builds and lets pages
  // render empty/default states instead of throwing.
  const sqliteFallback = {
    prepare: (_sql: string) => ({
      get: (..._args: any[]) => null,
      all: (..._args: any[]) => [],
      run: (..._args: any[]) => ({ changes: 0 }),
    }),
    transaction: (fn: Function) => {
      // run the transaction callback immediately; it's safe because shimmed queries are no-ops
      return fn()
    },
  }

  db = drizzleDb
  sqlite = sqliteInstance ?? sqliteFallback

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.sqliteInstance = sqliteInstance
    globalForDb.drizzleDb = drizzleDb
  }
}
