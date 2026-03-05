const Database = require('better-sqlite3')
const db = new Database('./data/dev.db', { readonly: true })
function tryQuery(q) {
  try { return db.prepare(q).all() } catch (e) { return null }
}
console.log('Course (capitalized):', tryQuery('SELECT id,title,slug FROM "Course" LIMIT 5'))
console.log('courses (lowercase):', tryQuery('SELECT id,title,slug FROM "courses" LIMIT 5'))
