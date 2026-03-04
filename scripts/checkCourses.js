const db = require('better-sqlite3')('./data/dev.db');

const courses = db.prepare('SELECT id, title, slug, description, price, duration, level, category, thumbnail FROM "Course"').all();

courses.forEach(c => {
  const mods = db.prepare('SELECT id, title, description FROM "Module" WHERE courseId = ?').all(c.id);
  let lessonCount = 0;
  mods.forEach(m => {
    const cnt = db.prepare('SELECT COUNT(*) as cnt FROM "Lesson" WHERE moduleId = ?').get(m.id);
    lessonCount += cnt.cnt;
  });

  console.log('\n=== ' + c.title + ' ===');
  console.log('  slug:', c.slug);
  console.log('  price:', c.price, '| duration:', c.duration, '| level:', c.level, '| category:', c.category);
  console.log('  thumbnail:', c.thumbnail ? 'YES' : 'null');
  console.log('  description:', c.description ? c.description.substring(0, 80) + '...' : 'null');
  console.log('  modules:', mods.length, '| total lessons:', lessonCount);

  mods.forEach(m => {
    const lessons = db.prepare('SELECT id, title, videoUrl, duration, content FROM "Lesson" WHERE moduleId = ?').all(m.id);
    console.log('    Module: ' + m.title + ' (' + lessons.length + ' lessons)');
    lessons.forEach(l => {
      console.log('      - ' + l.title + ' | video:', l.videoUrl ? 'YES' : 'null', '| dur:', l.duration || 'null');
    });
  });
});
