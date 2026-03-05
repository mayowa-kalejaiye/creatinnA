#!/usr/bin/env node
/**
 * Generate Postgres-compatible SQL files (CREATE TABLE + INSERTs) from local SQLite DB.
 * Output files are written to ./scripts/sql-dumps/<table>.sql
 *
 * Usage:
 *   node scripts/generate_sql_for_supabase.js
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config()
const Database = require('better-sqlite3')

const sqliteUrl = process.env.DATABASE_URL || 'file:./data/dev.db'
let sqlitePath = sqliteUrl.startsWith('file:') ? sqliteUrl.slice(5) : sqliteUrl
sqlitePath = sqlitePath.replace(/^"|"$/g, '')

if (!fs.existsSync(sqlitePath)) {
  console.error('SQLite file not found at', sqlitePath)
  process.exit(1)
}

const outDir = path.join(__dirname, 'sql-dumps')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const db = new Database(sqlitePath, { readonly: true })

function mapType(sqliteType) {
  if (!sqliteType) return 'text'
  const t = sqliteType.toLowerCase()
  if (t.includes('int')) return 'bigint'
  if (t.includes('char') || t.includes('clob') || t.includes('text')) return 'text'
  if (t.includes('blob')) return 'bytea'
  if (t.includes('real') || t.includes('floa') || t.includes('doub')) return 'double precision'
  if (t.includes('numeric') || t.includes('decim')) return 'numeric'
  return 'text'
}

function quoteIdent(s) {
  return '"' + String(s).replace(/"/g, '""') + '"'
}

function escapeLiteral(val) {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'number') return String(val)
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  // Buffer/Uint8Array -> hex literal
  if (Buffer.isBuffer(val)) return "E'\\x" + val.toString('hex') + "'"
  // otherwise string
  const s = String(val)
  // escape single quotes by doubling
  return "'" + s.replace(/'/g, "''") + "'"
}

function getTables() {
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()
  return rows.map(r => r.name)
}

function getTableInfo(table) {
  return db.prepare(`PRAGMA table_info("${table}")`).all()
}

function getCreateTableSql(table, cols) {
  const colDefs = cols.map(c => {
    const name = quoteIdent(c.name)
    const type = mapType(c.type)
    const notnull = c.notnull ? ' NOT NULL' : ''
    const dflt = (c.dflt_value !== null && c.dflt_value !== undefined) ? (' DEFAULT ' + c.dflt_value) : ''
    return `${name} ${type}${notnull}${dflt}`
  })
  // primary key
  const pks = cols.filter(c => c.pk).map(c => quoteIdent(c.name))
  const pkSql = pks.length ? `, PRIMARY KEY (${pks.join(',')})` : ''
  const sql = `CREATE TABLE IF NOT EXISTS ${quoteIdent(table)} (\n  ${colDefs.join(',\n  ')}${pkSql}\n);\n`;
  return sql
}

function writeSqlFile(table) {
  const cols = getTableInfo(table)
  if (!cols || cols.length === 0) {
    console.warn('Skipping empty table', table)
    return
  }

  const createSql = getCreateTableSql(table, cols)

  // Read rows
  const colNames = cols.map(c => c.name)
  const selectSql = `SELECT ${colNames.map(c => '"' + c + '"').join(', ')} FROM "${table}"`
  const rows = db.prepare(selectSql).all()

  const parts = []
  parts.push(`-- Dump for table: ${table}`)
  parts.push(`DROP TABLE IF EXISTS ${quoteIdent(table)};`)
  parts.push(createSql)

  if (rows.length > 0) {
    const batchSize = 500
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const values = batch.map(r => '(' + colNames.map(c => escapeLiteral(r[c])).join(', ') + ')').join(',\n')
      const insert = `INSERT INTO ${quoteIdent(table)}(${colNames.map(quoteIdent).join(', ')}) VALUES\n${values};`;
      parts.push(insert)
    }
  }

  const out = parts.join('\n\n') + '\n'
  const target = path.join(outDir, `${table}.sql`)
  fs.writeFileSync(target, out, 'utf8')
  console.log('Wrote', target, rows.length, 'rows')
}

function main() {
  const tables = getTables()
  console.log('Found tables:', tables.join(', '))
  for (const t of tables) {
    try { writeSqlFile(t) } catch (e) { console.error('Failed', t, e.message || e) }
  }
  db.close()
  console.log('Done. SQL files in', outDir)
}

main()
