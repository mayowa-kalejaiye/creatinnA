// Inspect local DB Course rows to confirm data accessible via adapter
const { sqlite } = require('../lib/prisma')
if (!sqlite) {
  console.error('sqlite not available')
  process.exit(1)
}
try {
  const rows = sqlite.prepare('SELECT id, title, slug FROM "Course"').all()
  console.log('Course rows (capitalized table):', rows)
} catch (e) {
  console.log('No capitalized Course table or error:', e.message)
}
try {
  const rows2 = sqlite.prepare('SELECT id, title, slug FROM "courses"').all()
  console.log('courses rows (lowercase table):', rows2)
} catch (e) {
  console.log('No lowercase courses table or error:', e.message)
}
