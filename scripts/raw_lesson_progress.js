require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  const c = new Client({ connectionString: conn });
  await c.connect();
  const userId = '9a491fb0-5421-459d-b3bb-3956f8290bfe';
  const courseId = '6bf44878-d1c8-419d-8a2e-6982a74f938b';
  const res = await c.query(
    `SELECT l.id, l.title, COALESCE(p.completed,0) as completed
       FROM "Lesson" l
       JOIN "Module" m ON m.id = l."moduleId"
       LEFT JOIN "Progress" p ON p."lessonId" = l.id AND p."userId" = $1
       WHERE m."courseId" = $2
       ORDER BY l."createdAt" ASC`,
    [userId, courseId]
  );
  console.log('lesson progress rows:', JSON.stringify(res.rows, null, 2));
  await c.end();
})();
