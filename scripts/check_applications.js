require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL ||
    'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c = new Client({ connectionString: conn });
  await c.connect();
  const res = await c.query(
    `SELECT a.*, u.name as userName, u.email as userEmail, u.phone as userPhone
     FROM "applications" a
     LEFT JOIN "users" u ON u.id = a."userId"
     WHERE a.status = 'pending'`
  );
  console.log('pending apps:', JSON.stringify(res.rows, null, 2));
  await c.end();
}

main().catch(console.error);
