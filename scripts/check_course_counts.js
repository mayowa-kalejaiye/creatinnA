require('dotenv').config();
const { Client }=require('pg');
(async()=>{
  const uri=process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || 'postgresql://postgres%2Ewkxtdkycqapzkkngshlh:MolGXpIbEUSIAdKg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';
  const c=new Client({connectionString:uri});
  await c.connect();
  const res = await c.query(
    `SELECT c.id, c.title, COALESCE(ec.enroll_count,0) AS enrollmentsCount, COALESCE(mc.module_count,0) AS modulesCount
     FROM "Course" c
     LEFT JOIN (SELECT "courseId", COUNT(1) AS enroll_count FROM "Enrollment" GROUP BY "courseId") ec ON ec."courseId" = c.id
     LEFT JOIN (SELECT "courseId", COUNT(1) AS module_count FROM "Module" GROUP BY "courseId") mc ON mc."courseId" = c.id
     ORDER BY c."createdAt" DESC`
  );
  console.log('counts:', JSON.stringify(res.rows, null, 2));
  await c.end();
})();
