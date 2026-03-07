require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL ||
    'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c = new Client({ connectionString: conn });
  await c.connect();
  const query = `SELECT u.id, u.name, u.email, u.phone, u.role, u."createdAt", \
    e."courseId", e."enrolledAt" as enrollmentDate, e.status as enrollmentStatus, c.title as courseTitle \
    FROM "users" u \
    LEFT JOIN "Enrollment" e ON e."userId" = u.id \
    LEFT JOIN "Course" c ON c.id = e."courseId" \
    WHERE u.role != 'ADMIN' AND u.password != '__applicant__' \
    ORDER BY u."createdAt" DESC`;
  const res = await c.query(query);
  console.log('student rows:', JSON.stringify(res.rows, null, 2));
  await c.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
