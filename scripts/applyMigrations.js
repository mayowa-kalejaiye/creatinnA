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
  // Some migration files include their own transaction wrappers (BEGIN/COMMIT).
  // Avoid starting a transaction if the SQL already contains transaction markers.
  const hasTransaction = /\bBEGIN\b|\bCOMMIT\b/i.test(sql);

  try {
    if (hasTransaction) {
      // Let the migration SQL manage its own transaction
      db.exec(sql);
      // If it succeeded, mark applied
      db.prepare('INSERT INTO _drizzle_migrations (id, applied_at) VALUES (?, ?)').run(id, new Date().toISOString());
      console.log('applied:', id);
    } else {
      db.exec('BEGIN');
      db.exec(sql);
      db.prepare('INSERT INTO _drizzle_migrations (id, applied_at) VALUES (?, ?)').run(id, new Date().toISOString());
      db.exec('COMMIT');
      console.log('applied:', id);
    }
  } catch (err) {
    const msg = String(err && err.message ? err.message : err).toLowerCase();
    // Handle benign "already exists" / duplicate-column errors gracefully
    if (msg.includes('already exists') || msg.includes('duplicate column') || msg.includes('duplicate column name')) {
      console.warn('benign migration error, marking as applied:', id, msg);
      try {
        db.prepare('INSERT INTO _drizzle_migrations (id, applied_at) VALUES (?, ?)').run(id, new Date().toISOString());
        // If we started a transaction for this migration, ensure it's committed
        if (!hasTransaction) db.exec('COMMIT');
        console.log('marked as applied (skipped error):', id);
        continue;
      } catch (e2) {
        try { if (!hasTransaction) db.exec('ROLLBACK'); } catch {}
        console.error('failed to mark migration applied after benign error', id, e2);
        process.exit(1);
      }
    }

    // For other errors, rollback if we opened a transaction
    try { if (!hasTransaction) db.exec('ROLLBACK'); } catch {}
    console.error('failed to apply', id, err);
    process.exit(1);
  }
}

console.log('All migrations processed.');
