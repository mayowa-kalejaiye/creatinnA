/* Apply Drizzle SQL migration files to local sqlite DB (skips already applied) */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const migrationsDir = path.join(__dirname, '..', 'drizzle', 'migrations');
let dbPath = process.env.DATABASE_URL || './data/dev.db';
// handle values like "file:./data/dev.db" or ./data/dev.db
if (dbPath.startsWith('file:')) dbPath = dbPath.slice('file:'.length);
dbPath = dbPath.replace(/^"(.*)"$/, '$1');

// ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

if (!fs.existsSync(migrationsDir)) {
  console.error('Migrations directory not found:', migrationsDir);
  process.exit(1);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// track applied migrations
db.prepare(`
  CREATE TABLE IF NOT EXISTS _drizzle_migrations (
    id TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  )
`).run();

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

for (const file of files) {
  const id = file;
  const exists = db.prepare('SELECT 1 FROM _drizzle_migrations WHERE id = ?').get(id);
  if (exists) {
    console.log('skip:', id);
    continue;
  }

  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  try {
    db.exec('BEGIN');
    db.exec(sql);
    db.prepare('INSERT INTO _drizzle_migrations (id, applied_at) VALUES (?, ?)').run(id, new Date().toISOString());
    db.exec('COMMIT');
    console.log('applied:', id);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('failed to apply', id, err);
    process.exit(1);
  }
}

console.log('All migrations processed.');
