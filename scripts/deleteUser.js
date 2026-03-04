const Database = require('better-sqlite3');
const db = new Database('./data/dev.db');
const email = 'admin@creatinn.test';
try {
  let changes = 0;
  try {
    const res = db.prepare("DELETE FROM users WHERE email = ?").run(email);
    console.log('users deleted:', res.changes);
    changes += res.changes;
  } catch (e) {
    console.error('delete users failed:', e.message);
  }
  try {
    const res2 = db.prepare('DELETE FROM "User" WHERE email = ?').run(email);
    console.log('User deleted:', res2.changes);
    changes += res2.changes;
  } catch (e) {
    console.error('delete User failed:', e.message);
  }
  console.log('total changes:', changes);
} finally {
  db.close();
}
