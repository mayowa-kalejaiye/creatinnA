const Database = require('better-sqlite3')
const db = new Database('./data/dev.db', { readonly: true })
function count(table){
  try{ const r = db.prepare(`SELECT count(*) as c FROM \"${table}\"`).get(); return r.c }catch(e){ return null }
}
console.log('users:', count('users'))
console.log('Course:', count('Course'))
console.log('courses:', count('courses'))
console.log('Module:', count('Module'))
console.log('Lesson:', count('Lesson'))
