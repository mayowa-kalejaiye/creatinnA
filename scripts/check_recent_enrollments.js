require('dotenv').config();
const { Client } = require('pg');
(async () => {
  const conn = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  const c = new Client({ connectionString: conn });
  await c.connect();
  const res = await c.query(
    `SELECT e.id, e."userId", e."courseId", e.status, e.progress, e."enrolledAt",
            u.name as "userName", u.email as "userEmail",
            c.title as "courseTitle",
            (SELECT COUNT(l.id) FROM "Lesson" l JOIN "Module" m ON m.id = l."moduleId" WHERE m."courseId" = e."courseId") as total_lessons,
            (SELECT COUNT(p.id) FROM "Progress" p JOIN "Lesson" l ON l.id = p."lessonId" JOIN "Module" m ON m.id = l."moduleId" WHERE p."userId" = e."userId" AND m."courseId" = e."courseId" AND p.completed = 1) as completed_lessons
     FROM "Enrollment" e
     LEFT JOIN "users" u ON u.id = e."userId"
     LEFT JOIN "Course" c ON c.id = e."courseId"
     ORDER BY e."enrolledAt" DESC
     LIMIT 10`
  );
  console.log('recent enrollments:', JSON.stringify(res.rows, null, 2));
  await c.end();
})();
