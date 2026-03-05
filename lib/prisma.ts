import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

let sqlitePath = process.env.DATABASE_URL ?? './data/dev.db'
if (sqlitePath.startsWith('file:')) sqlitePath = sqlitePath.slice('file:'.length);
sqlitePath = sqlitePath.replace(/^"(.*)"$/, '$1'); // Remove quotes if present

// Lazily create the connection and handle native binding failures gracefully.
function createConnectionSafe() {
  try {
    return new Database(sqlitePath)
  } catch (err) {
    // Log a helpful warning but do not throw so module import doesn't crash the runtime.
    // This is important for serverless environments (like Vercel) where native
    // modules or writable file-system access may be unavailable.
    // eslint-disable-next-line no-console
    console.error('better-sqlite3 failed to load native bindings (continuing without DB):', err)
    return null
  }
}

type SqliteInstance = ReturnType<typeof createConnectionSafe>
type DrizzleDb = ReturnType<typeof drizzle> | null

const globalForDb = globalThis as unknown as {
  sqliteInstance: SqliteInstance | undefined
  drizzleDb: DrizzleDb | undefined
}

const sqliteInstance = globalForDb.sqliteInstance ?? createConnectionSafe()
let drizzleDb: DrizzleDb = null
if (sqliteInstance) {
  drizzleDb = globalForDb.drizzleDb ?? drizzle(sqliteInstance)
}

export const db = drizzleDb
// Export sqlite as `any` to avoid TypeScript "possibly null" errors in serverless builds
// where the native better-sqlite3 bindings may be unavailable at build time.
export const sqlite: any = sqliteInstance
export type DatabaseClient = DrizzleDb

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sqliteInstance = sqliteInstance
  globalForDb.drizzleDb = drizzleDb
}
