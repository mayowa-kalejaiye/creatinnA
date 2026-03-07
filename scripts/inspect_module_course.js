require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL ||
    'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c = new Client({ connectionString: conn });
  await c.connect();
  const courseId = '6bf44878-d1c8-419d-8a2e-6982a74f938b';
  const res = await c.query('SELECT id, title, "courseId" FROM "Module" WHERE "courseId" = $1', [courseId]);
  console.log('modules for course', JSON.stringify(res.rows, null, 2));
  const less = await c.query('SELECT id, title, "moduleId" FROM "Lesson" WHERE "moduleId" IN (SELECT id FROM "Module" WHERE "courseId" = $1)', [courseId]);
  console.log('lesson count', less.rows.length);
  await c.end();
}

main().catch(console.error);
