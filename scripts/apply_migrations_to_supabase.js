#!/usr/bin/env node
/*
  Apply SQL migration files from ./drizzle/migrations to a Postgres DB (Supabase).
  The script makes small text adjustments to convert simple SQLite SQL into Postgres-friendly SQL:
  - Replace backticks with double quotes
  - Remove PRAGMA statements
  - Remove the custom statement-breakpoint marker used in one migration

  Usage:
    SUPABASE_DB_URL="postgres://..." node scripts/apply_migrations_to_supabase.js

  Note: Review the SQL files afterward; complex SQLite-specific constructs may still require manual edits.
*/

const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { Pool } = require('pg')

const pgUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL
if (!pgUrl) {
  console.error('Missing SUPABASE_DB_URL or DATABASE_URL in environment')
  process.exit(1)
}

const migrationsDir = path.join(__dirname, '..', 'drizzle', 'migrations')
if (!fs.existsSync(migrationsDir)) {
  console.error('Migrations directory not found:', migrationsDir)
  process.exit(1)
}

const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
if (files.length === 0) {
  console.error('No .sql migration files found in', migrationsDir)
  process.exit(1)
}

// Use a Pool (session pooling friendly). Enable SSL unless connecting to localhost.
const pgOptions = {
  connectionString: pgUrl,
  max: parseInt(process.env.PG_MAX_CLIENTS || '5', 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
}

// Support direct-IP override to avoid DNS resolution problems in local networks.
if (process.env.SUPABASE_HOST_IP) {
  try {
    const u = new URL(pgUrl)
    pgOptions.host = process.env.SUPABASE_HOST_IP
    pgOptions.port = u.port || (u.protocol === 'postgres:' || u.protocol === 'postgresql:' ? '5432' : '')
    pgOptions.user = decodeURIComponent(u.username)
    pgOptions.password = decodeURIComponent(u.password)
    pgOptions.database = u.pathname ? u.pathname.replace(/^\//, '') : undefined
    delete pgOptions.connectionString
    pgOptions.ssl = { rejectUnauthorized: false }
  } catch (e) {
    console.warn('SUPABASE_HOST_IP provided but failed to parse SUPABASE_DB_URL, falling back to connectionString:', e && e.message)
  }
} else if (!/localhost|127\.0\.0\.1/.test(pgUrl)) {
  pgOptions.ssl = { rejectUnauthorized: false }
}

const client = new Pool(pgOptions)

function transformSqlForPostgres(sql) {
  // Basic conversions
  let out = sql
  // replace backticks with double quotes
  out = out.replace(/`/g, '"')
  // remove pragma lines
  out = out.replace(/PRAGMA[^\n]*\n?/gi, '')
  // remove custom marker
  out = out.replace(/--> statement-breakpoint\n?/g, '')
  return out
}

async function applyFile(file) {
  const full = path.join(migrationsDir, file)
  console.log('Applying', file)
  let sql = fs.readFileSync(full, 'utf8')
  sql = transformSqlForPostgres(sql)

  try {
    // Execute as a single query; multiple statements are allowed by pg when separated by semicolons.
    await client.query(sql)
    console.log('Applied', file)
  } catch (err) {
    console.error('Error applying', file, err.message || err)
    throw err
  }
}

async function main() {
  try {
    // Pool - test connectivity
    await client.query('SELECT 1')
    for (const f of files) {
      await applyFile(f)
    }
    console.log('All migrations applied')
  } catch (err) {
    console.error('Migration process failed:', err.message || err)
  } finally {
    try { await client.end() } catch (e) {}
  }
}

main()
