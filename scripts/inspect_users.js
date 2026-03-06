require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c = new Client({ connectionString: conn });
  await c.connect();
  const res = await c.query('SELECT id,email,role,password FROM "users"');
  console.log('users:', JSON.stringify(res.rows, null, 2));
  await c.end();
}

main().catch(console.error);
