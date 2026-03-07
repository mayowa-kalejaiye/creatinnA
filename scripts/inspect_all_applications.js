require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  const c = new Client({ connectionString: conn });
  await c.connect();
  const res = await c.query('SELECT * FROM "applications"');
  console.log('all apps:', JSON.stringify(res.rows, null, 2));
  await c.end();
})();
