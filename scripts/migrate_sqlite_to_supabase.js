#!/usr/bin/env node
/*
  Simple migration helper: copies rows from local SQLite to a Postgres DB (Supabase).
  Requirements:
  - Run your migrations/schema on the Supabase DB first so target tables exist.
  - Install dev deps: `npm install` (we added `pg` and `dotenv`).

  Usage (local):
    SUPABASE_DB_URL="postgres://..." DATABASE_URL="file:./data/dev.db" node scripts/migrate_sqlite_to_supabase.js

  The script will: list tables in SQLite, for each table that exists in Postgres it will copy overlapping columns
  and use `ON CONFLICT (id) DO UPDATE` when an `id` column exists.
*/

const path = require('path')
const fs = require('fs')
require('dotenv').config()
const Database = require('better-sqlite3')
const { Pool } = require('pg')

const sqliteUrl = process.env.DATABASE_URL || process.env.SQLITE_URL || 'file:./data/dev.db'
const pgUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!pgUrl) {
  console.error('Missing SUPABASE_DB_URL in environment. Set SUPABASE_DB_URL to your Supabase/Postgres connection string.')
  process.exit(1)
}

let sqlitePath = sqliteUrl
if (sqlitePath.startsWith('file:')) sqlitePath = sqlitePath.slice('file:'.length)
sqlitePath = sqlitePath.replace(/^"(.*)"$/, '$1')

if (!fs.existsSync(sqlitePath)) {
  console.error('SQLite file not found at', sqlitePath)
  process.exit(1)
}

const sqlite = new Database(sqlitePath, { readonly: true })
// Use a Pool (session pooling friendly). Enable SSL unless connecting to localhost.
const pgOptions = {
  connectionString: pgUrl,
  max: parseInt(process.env.PG_MAX_CLIENTS || '10', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
}

// If the environment provides a direct IP to avoid DNS resolution, parse the URL and use explicit host/port/user/password/database.
if (process.env.SUPABASE_HOST_IP) {
  try {
    const u = new URL(pgUrl)
    pgOptions.host = process.env.SUPABASE_HOST_IP
    pgOptions.port = u.port || (u.protocol === 'postgres:' || u.protocol === 'postgresql:' ? '5432' : '')
    pgOptions.user = decodeURIComponent(u.username)
    pgOptions.password = decodeURIComponent(u.password)
    pgOptions.database = u.pathname ? u.pathname.replace(/^\//, '') : undefined
    // When using direct IP, set connectionString to undefined so Pool uses explicit options.
    delete pgOptions.connectionString
    pgOptions.ssl = { rejectUnauthorized: false }
  } catch (e) {
    console.warn('SUPABASE_HOST_IP provided but failed to parse SUPABASE_DB_URL, falling back to connectionString:', e && e.message)
  }
} else if (!/localhost|127\.0\.0\.1/.test(pgUrl)) {
  pgOptions.ssl = { rejectUnauthorized: false }
}

const pg = new Pool(pgOptions)

async function tableExistsInPg(tableName) {
  const res = await pg.query(
    `select 1 from information_schema.tables where table_schema = current_schema() and table_name = $1 limit 1`,
    [tableName.toLowerCase()]
  )
  return res.rowCount > 0
}

async function getPgColumns(tableName) {
  const res = await pg.query(
    `select column_name from information_schema.columns where table_schema = current_schema() and table_name = $1`,
    [tableName.toLowerCase()]
  )
  return res.rows.map(r => r.column_name)
}

function getSqliteTables() {
  const rows = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()
  return rows.map(r => r.name)
}

async function migrateTable(table) {
  try {
    const pragma = sqlite.prepare(`PRAGMA table_info("${table}")`).all()
    const sqliteCols = pragma.map(c => c.name)

    const existsInPg = await tableExistsInPg(table)
    if (!existsInPg) {
      console.warn(`Skipping table ${table}: not found in Postgres target. Create schema first.`)
      return
    }

    const pgCols = await getPgColumns(table)
    const commonCols = sqliteCols.filter(c => pgCols.includes(c))
    if (commonCols.length === 0) {
      console.warn(`No common columns for table ${table}; skipping.`)
      return
    }

    const selectColsSql = commonCols.map(c => `"${c}"`).join(',')
    const rows = sqlite.prepare(`SELECT ${selectColsSql} FROM "${table}"`).all()

    const placeholders = commonCols.map((_, i) => `$${i + 1}`).join(',')
    const insertCols = commonCols.map(c => c).join(',')
    const hasId = commonCols.includes('id') && pgCols.includes('id')
    const updateSet = commonCols.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')
    const insertSql = hasId
      ? `INSERT INTO ${table.toLowerCase()}(${insertCols}) VALUES (${placeholders}) ON CONFLICT (id) DO UPDATE SET ${updateSet}`
      : `INSERT INTO ${table.toLowerCase()}(${insertCols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`

    console.log(`Migrating ${rows.length} rows into ${table} (columns: ${commonCols.join(',')})`)

    for (const r of rows) {
      const vals = commonCols.map(c => r[c])
      try {
        await pg.query(insertSql, vals)
      } catch (err) {
        console.error(`Error inserting into ${table}:`, err.message || err)
      }
    }

    console.log(`Finished ${table}`)
  } catch (err) {
    console.error(`Failed migrating table ${table}:`, err.message || err)
  }
}


async function main() {
  try {
    // Pool will handle connections; test a simple query to verify connectivity.
    await pg.query('SELECT 1')
    const tables = getSqliteTables()
    console.log('Found sqlite tables:', tables.join(', '))

    for (const t of tables) {
      await migrateTable(t)
    }

    console.log('Migration complete')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    try { await pg.end() } catch (e) {}
    sqlite.close()
  }
}

main()
