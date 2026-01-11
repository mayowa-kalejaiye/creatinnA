import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

let sqlitePath = process.env.DATABASE_URL ?? './data/dev.db'
if (sqlitePath.startsWith('file:')) sqlitePath = sqlitePath.slice('file:'.length);
sqlitePath = sqlitePath.replace(/^"(.*)"$/, '$1'); // Remove quotes if present

const createConnection = () => new Database(sqlitePath)
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
