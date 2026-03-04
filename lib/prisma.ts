import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

let sqlitePath = process.env.DATABASE_URL ?? './data/dev.db'
if (sqlitePath.startsWith('file:')) sqlitePath = sqlitePath.slice('file:'.length);
sqlitePath = sqlitePath.replace(/^"(.*)"$/, '$1'); // Remove quotes if present

const createConnection = () => {
  try {
    return new Database(sqlitePath)
  } catch (err) {
    // Provide a clearer runtime error to help debugging native binding issues
    // Common fixes: run `npm rebuild better-sqlite3` or reinstall with
    // `npm install --build-from-source better-sqlite3` and ensure Windows
    // Build Tools are available.
    // Re-throw a helpful message so Next's server output is actionable.
    // eslint-disable-next-line no-console
    console.error('better-sqlite3 failed to load native bindings:', err)
    throw new Error(
      'better-sqlite3 native bindings not found. Try: `npm rebuild better-sqlite3` or `npm install --build-from-source better-sqlite3`. Ensure required build tools are installed.'
    )
  }
}
type SqliteInstance = ReturnType<typeof createConnection>
type DrizzleDb = ReturnType<typeof drizzle>

const globalForDb = globalThis as unknown as {
  sqliteInstance: SqliteInstance | undefined
  drizzleDb: DrizzleDb | undefined
}

const sqliteInstance = globalForDb.sqliteInstance ?? createConnection()
const drizzleDb = globalForDb.drizzleDb ?? drizzle(sqliteInstance)

export const db = drizzleDb
export const sqlite = sqliteInstance
export type DatabaseClient = DrizzleDb

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sqliteInstance = sqliteInstance
  globalForDb.drizzleDb = drizzleDb
}
