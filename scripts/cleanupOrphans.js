const Database = require('better-sqlite3');
const db = new Database('./data/dev.db');
try {
  const batches = [
    { name: 'Enrollment', table: '"Enrollment"' },
    { name: 'Progress', table: '"Progress"' },
    { name: 'Payment', table: '"Payment"' },
    { name: 'payments', table: 'payments' },
    { name: 'applications', table: 'applications' },
    { name: 'payments (uppercase)', table: '"payments"' },
  ];

  let total = 0;
  for (const b of batches) {
    try {
      const res = db.prepare(`DELETE FROM ${b.table} WHERE userId NOT IN (SELECT id FROM users)`).run();
      console.log(`${b.name}: deleted ${res.changes} orphaned rows`);
      total += res.changes;
    } catch (e) {
      console.error(`${b.name}: failed (${e.message})`);
    }
  }

  // Also remove any progress rows where there is no matching lesson
  try {
    const res2 = db.prepare(`DELETE FROM "Progress" WHERE lessonId NOT IN (SELECT id FROM "Lesson")`).run();
    console.log(`Progress rows with missing lesson deleted: ${res2.changes}`);
    total += res2.changes;
  } catch (e) { console.error('cleanup progress by lesson failed:', e.message); }

  console.log('Total orphan rows removed:', total);
} finally { db.close(); }
