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

// Provide the same sqlite fallback used for local dev so callers that do
// `sqlite.prepare(...).get()` don't crash during build/prerender when we
// prefer Postgres for runtime. Postgres connections are initialized lazily.
const sqliteFallback = {
  prepare: (_sql: string) => ({
    get: (..._args: any[]) => null,
    all: (..._args: any[]) => [],
    run: (..._args: any[]) => ({ changes: 0 }),
  }),
  transaction: (fn: Function) => {
    return fn()
  },
}

if (PROD_DB_URL) {
  // Production: lazily initialize Postgres Pool and Drizzle adapter when first used.
  let pool: any = null
  let pgDb: any = null

  function ensurePg() {
    if (!pool) {
      pool = new Pool({ connectionString: PROD_DB_URL })
      pgDb = pgDrizzle(pool)
      if (process.env.NODE_ENV !== 'production') {
        ;(globalThis as any).pgPool = pool
        ;(globalThis as any).drizzleDb = pgDb
      }
    }
    return { pool, pgDb }
  }

  // `db` is a lightweight proxy that initializes the real `pgDrizzle` instance on first access.
  db = new Proxy({}, {
    get(_, prop) {
      const { pgDb: real } = ensurePg()
      if (!real) return undefined
      return (real as any)[prop]
    },
    apply(_target, _thisArg, args) {
      const { pgDb: real } = ensurePg()
      if (!real) throw new Error('Postgres DB not available')
      return (real as any).apply(_thisArg, args)
    },
  })

  // Keep a sqlite-compatible fallback so build-time code that expects `sqlite.prepare` works.
  sqlite = sqliteFallback
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

  db = drizzleDb
  sqlite = sqliteInstance ?? sqliteFallback

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.sqliteInstance = sqliteInstance
    globalForDb.drizzleDb = drizzleDb
  }
}
