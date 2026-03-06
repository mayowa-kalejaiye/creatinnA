// Run with: SUPABASE_DB_URL="postgres://..." node scripts/check_supabase_connection.js
// or: DATABASE_URL="postgres://..." USE_SUPABASE=1 node scripts/check_supabase_connection.js

const { Client } = require('pg');

async function main() {
  // allow hardcoding the URL here as a fallback to avoid shell quoting issues
  process.env.SUPABASE_DB_URL = process.env.SUPABASE_DB_URL ||
    'postgresql://postgres:mayorkay%40200801@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('No SUPABASE_DB_URL or DATABASE_URL set in environment.');
    process.exit(2);
  }

  console.log('Using DB URL (first 80 chars):', url.slice(0, 80) + (url.length > 80 ? '...' : ''));
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query("SELECT count(*) as cnt FROM pg_class WHERE relkind = 'r'");
    console.log('Connected to Postgres. Table count (approx):', res.rows[0].cnt);

    // Try a simple query for typical tables
    try {
      const users = await client.query('SELECT COUNT(1) as users FROM "users"');
      console.log('users count:', users.rows[0].users);
    } catch (e) {
      console.warn('Could not query "users" table:', e.message || e);
    }
    try {
      const courses = await client.query('SELECT COUNT(1) as courses FROM "courses"');
      console.log('courses count:', courses.rows[0].courses);
    } catch (e) {
      console.warn('Could not query "courses" table:', e.message || e);
    }

    await client.end();
    console.log('Connection test complete.');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message || err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

main();
