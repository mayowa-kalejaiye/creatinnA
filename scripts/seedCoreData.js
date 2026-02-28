require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

let dbPath = process.env.DATABASE_URL || './data/dev.db';
if (dbPath.startsWith('file:')) dbPath = dbPath.slice('file:'.length);
dbPath = dbPath.replace(/^"(.*)"$/, '$1');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

function genId() {
  return (globalThis).crypto?.randomUUID?.() ?? String(Date.now());
}

(async function seed() {
  try {
    const now = new Date().toISOString();

    // Admin credentials (change before production)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@creatinn.test';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Ensure users table exists
    const hasUsers = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!hasUsers) {
      console.error('users table not found. Run migrations first.');
      process.exit(1);
    }

    // Check if admin exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
    if (existing) {
      console.log('Admin user already exists:', adminEmail);
    } else {
      const id = genId();
      const hash = bcrypt.hashSync(adminPassword, 10);
      db.prepare('INSERT INTO users (id, name, email, password, phone, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(id, adminName, adminEmail, hash, null, 'ADMIN', now, now);
      console.log('Created admin user:', adminEmail, '(password:', adminPassword + ')');
    }

    // Seed sample course
    const hasCourseTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Course'").get();
    if (!hasCourseTable) {
      console.warn('Course table not found; skipping sample course creation.');
    } else {
      const slug = 'intro-video-editing';
      const existingCourse = db.prepare('SELECT * FROM "Course" WHERE slug = ?').get(slug);
      if (existingCourse) {
        console.log('Sample course already exists:', slug);
      } else {
        const courseId = genId();
        db.prepare('INSERT INTO "Course" (id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .run(courseId, 'Intro to Video Editing', slug, 'Short intensive on video editing fundamentals', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', 30000, '2 weeks', 'Beginner', 1, 'Video', now, now);
        console.log('Created sample course:', slug);
      }
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
})();
