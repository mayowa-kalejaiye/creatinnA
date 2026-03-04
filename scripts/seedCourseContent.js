const crypto = require('crypto');
const db = require('better-sqlite3')('./data/dev.db');
const uuid = () => crypto.randomUUID();
const now = new Date().toISOString();

// ────────────────────────────────────────────────────────────
// 1) Update descriptions to be richer for all 3 courses
// ────────────────────────────────────────────────────────────

const descriptions = {
  '2-week-video-editing-intensive': `Our flagship 2-Week Video Editing Intensive is a physically-held, mentor-led program designed for aspiring editors who want to learn professional-grade video editing in an accelerated, disciplined environment.\n\nOnly 3 students are admitted per cohort — ensuring each student gets direct, hands-on guidance from our senior editors. You'll move through real-world projects, master industry-standard tools, and build a portfolio piece by the end of the program.\n\nThis is not a casual workshop. It is a structured, selective training built for people who are serious about developing a marketable creative skill.`,

  '1-on-1-mastery-track': `The 1-on-1 Mastery Track is our highest-touch offering — a private mentorship designed for busy professionals, entrepreneurs, and creators who need flexibility without sacrificing depth.\n\nYou'll work directly with a senior CreatINN mentor on a schedule that fits your life. Sessions are tailored to your skill level, your goals, and the kind of content you want to create or monetize.\n\nThis track covers everything from technical editing skills to creative direction, content strategy, and monetization thinking. It's not just about learning software — it's about learning to think like a professional creative.\n\nIdeal for professionals who want elite-level skills without the cohort format.`,

  'online-video-editing': `The Online Video Editing Course is a self-paced digital program that teaches you the fundamentals of professional video editing from anywhere in the world.\n\nYou'll learn through structured video lessons, practical exercises, and downloadable resources — all accessible on your own schedule. The course covers timeline editing, color grading, audio mixing, transitions, effects, and export workflows.\n\nThis course is designed for self-starters who want practical skills at an accessible price point. Note: this track does not include mentorship or alumni status — it is a skill-building course only.`
};

for (const [slug, desc] of Object.entries(descriptions)) {
  db.prepare('UPDATE "Course" SET description = ?, updatedAt = ? WHERE slug = ?').run(desc, now, slug);
  console.log('Updated description for:', slug);
}

// ────────────────────────────────────────────────────────────
// 2) Seed modules & lessons for "1-on-1 Mastery Track"
// ────────────────────────────────────────────────────────────

const mastery = db.prepare('SELECT id FROM "Course" WHERE slug = ?').get('1-on-1-mastery-track');
if (mastery) {
  const existingMods = db.prepare('SELECT COUNT(*) as cnt FROM "Module" WHERE courseId = ?').get(mastery.id);
  if (existingMods.cnt === 0) {
    const modules = [
      {
        title: 'Foundation & Setup',
        description: 'Getting your editing environment ready and understanding the fundamentals.',
        order: 1,
        lessons: [
          { title: 'Welcome & Program Overview', duration: '10 mins', order: 1 },
          { title: 'Setting Up Your Editing Workspace', duration: '20 mins', order: 2 },
          { title: 'Understanding Timelines & Sequences', duration: '25 mins', order: 3 },
          { title: 'File Management & Project Organization', duration: '15 mins', order: 4 },
        ]
      },
      {
        title: 'Core Editing Techniques',
        description: 'Master the essential cuts, transitions, and timing that define professional work.',
        order: 2,
        lessons: [
          { title: 'The Art of the Cut', duration: '30 mins', order: 1 },
          { title: 'Pacing & Rhythm in Editing', duration: '25 mins', order: 2 },
          { title: 'Transitions That Tell Stories', duration: '20 mins', order: 3 },
          { title: 'Working with B-Roll & Overlays', duration: '25 mins', order: 4 },
          { title: 'Audio Sync & Sound Design Basics', duration: '30 mins', order: 5 },
        ]
      },
      {
        title: 'Color & Visual Identity',
        description: 'Develop your eye for color grading and consistent visual branding.',
        order: 3,
        lessons: [
          { title: 'Color Theory for Editors', duration: '20 mins', order: 1 },
          { title: 'Professional Color Grading Workflow', duration: '35 mins', order: 2 },
          { title: 'Creating & Applying LUTs', duration: '25 mins', order: 3 },
          { title: 'Building a Consistent Visual Style', duration: '20 mins', order: 4 },
        ]
      },
      {
        title: 'Content Strategy & Monetization',
        description: 'Turn your editing skills into income streams and business opportunities.',
        order: 4,
        lessons: [
          { title: 'Thinking Like a Creative Entrepreneur', duration: '25 mins', order: 1 },
          { title: 'Pricing Your Editing Services', duration: '20 mins', order: 2 },
          { title: 'Building a Client Pipeline', duration: '30 mins', order: 3 },
          { title: 'Content Monetization Models', duration: '25 mins', order: 4 },
          { title: 'Portfolio Building & Positioning', duration: '20 mins', order: 5 },
        ]
      },
      {
        title: 'Advanced Techniques & Final Project',
        description: 'Push your skills with advanced workflows and create your capstone piece.',
        order: 5,
        lessons: [
          { title: 'Motion Graphics & Text Animation', duration: '35 mins', order: 1 },
          { title: 'Multi-Camera Editing', duration: '25 mins', order: 2 },
          { title: 'Advanced Audio Mixing', duration: '30 mins', order: 3 },
          { title: 'Final Project Brief & Guidance', duration: '15 mins', order: 4 },
          { title: 'Review & Next Steps', duration: '20 mins', order: 5 },
        ]
      }
    ];

    for (const mod of modules) {
      const modId = uuid();
      db.prepare('INSERT INTO "Module" (id, courseId, title, description, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(modId, mastery.id, mod.title, mod.description, mod.order, now, now);
      for (const les of mod.lessons) {
        db.prepare('INSERT INTO "Lesson" (id, moduleId, title, duration, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuid(), modId, les.title, les.duration, les.order, now, now);
      }
    }
    console.log('Seeded 1-on-1 Mastery Track: 5 modules, 23 lessons');
  } else {
    console.log('1-on-1 Mastery Track already has modules, skipping.');
  }
}

// ────────────────────────────────────────────────────────────
// 3) Seed modules & lessons for "Online Video Editing"
// ────────────────────────────────────────────────────────────

const online = db.prepare('SELECT id FROM "Course" WHERE slug = ?').get('online-video-editing');
if (online) {
  const existingMods = db.prepare('SELECT COUNT(*) as cnt FROM "Module" WHERE courseId = ?').get(online.id);
  if (existingMods.cnt === 0) {
    const modules = [
      {
        title: 'Getting Started',
        description: 'Set up your tools and understand the editing landscape.',
        order: 1,
        lessons: [
          { title: 'Course Introduction & What to Expect', duration: '8 mins', order: 1 },
          { title: 'Choosing Your Editing Software', duration: '12 mins', order: 2 },
          { title: 'Interface Tour & Key Shortcuts', duration: '18 mins', order: 3 },
          { title: 'Importing & Organizing Media', duration: '15 mins', order: 4 },
        ]
      },
      {
        title: 'Editing Fundamentals',
        description: 'Learn the core techniques every editor must know.',
        order: 2,
        lessons: [
          { title: 'Timeline Basics & Navigation', duration: '20 mins', order: 1 },
          { title: 'Cutting & Trimming Clips', duration: '22 mins', order: 2 },
          { title: 'Adding Transitions & Effects', duration: '18 mins', order: 3 },
          { title: 'Working with Text & Titles', duration: '15 mins', order: 4 },
          { title: 'Speed Ramping & Time Effects', duration: '20 mins', order: 5 },
        ]
      },
      {
        title: 'Audio Editing',
        description: 'Clean up, mix, and enhance audio in your projects.',
        order: 3,
        lessons: [
          { title: 'Audio Basics for Video Editors', duration: '15 mins', order: 1 },
          { title: 'Syncing Audio & Video', duration: '12 mins', order: 2 },
          { title: 'Noise Reduction & Cleanup', duration: '18 mins', order: 3 },
          { title: 'Music Selection & Mixing', duration: '20 mins', order: 4 },
        ]
      },
      {
        title: 'Color Grading Essentials',
        description: 'Give your videos a professional, polished look.',
        order: 4,
        lessons: [
          { title: 'Understanding Color Wheels & Scopes', duration: '18 mins', order: 1 },
          { title: 'Basic Color Correction Workflow', duration: '22 mins', order: 2 },
          { title: 'Creative Color Grading', duration: '25 mins', order: 3 },
          { title: 'Using LUTs Effectively', duration: '15 mins', order: 4 },
        ]
      },
      {
        title: 'Export & Delivery',
        description: 'Render and deliver your projects for any platform.',
        order: 5,
        lessons: [
          { title: 'Export Settings Explained', duration: '15 mins', order: 1 },
          { title: 'Rendering for YouTube & Social Media', duration: '12 mins', order: 2 },
          { title: 'File Formats & Codecs', duration: '18 mins', order: 3 },
          { title: 'Final Project & Course Wrap-Up', duration: '10 mins', order: 4 },
        ]
      }
    ];

    for (const mod of modules) {
      const modId = uuid();
      db.prepare('INSERT INTO "Module" (id, courseId, title, description, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(modId, online.id, mod.title, mod.description, mod.order, now, now);
      for (const les of mod.lessons) {
        db.prepare('INSERT INTO "Lesson" (id, moduleId, title, duration, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuid(), modId, les.title, les.duration, les.order, now, now);
      }
    }
    console.log('Seeded Online Video Editing: 5 modules, 21 lessons');
  } else {
    console.log('Online Video Editing already has modules, skipping.');
  }
}

// ────────────────────────────────────────────────────────────
// 4) Also update 2-Week Intensive description to be richer
//    and seed more modules/lessons if it only has 1
// ────────────────────────────────────────────────────────────

const intensive = db.prepare('SELECT id FROM "Course" WHERE slug = ?').get('2-week-video-editing-intensive');
if (intensive) {
  const existingMods = db.prepare('SELECT COUNT(*) as cnt FROM "Module" WHERE courseId = ?').get(intensive.id);
  if (existingMods.cnt <= 1) {
    // Add additional modules (keep existing ones)
    const additionalModules = [
      {
        title: 'Timeline Mastery',
        description: 'Deep dive into timeline workflows and professional editing speed.',
        order: 2,
        lessons: [
          { title: 'Advanced Timeline Navigation', duration: '20 mins', order: 1 },
          { title: 'Multi-Track Editing', duration: '25 mins', order: 2 },
          { title: 'Keyboard Shortcuts for Speed', duration: '15 mins', order: 3 },
          { title: 'Nested Sequences & Compound Clips', duration: '20 mins', order: 4 },
        ]
      },
      {
        title: 'Sound Design & Audio',
        description: 'Learn to mix, edit, and enhance audio like a pro.',
        order: 3,
        lessons: [
          { title: 'Audio Fundamentals for Editors', duration: '20 mins', order: 1 },
          { title: 'Dialogue Editing & Cleanup', duration: '25 mins', order: 2 },
          { title: 'Sound Effects & Foley', duration: '20 mins', order: 3 },
          { title: 'Music Editing & Mixing', duration: '25 mins', order: 4 },
        ]
      },
      {
        title: 'Portfolio Project',
        description: 'Create a professional-quality edit that showcases your skills.',
        order: 4,
        lessons: [
          { title: 'Project Brief & Creative Direction', duration: '15 mins', order: 1 },
          { title: 'Editing Session (Guided)', duration: '45 mins', order: 2 },
          { title: 'Review, Feedback & Polish', duration: '30 mins', order: 3 },
          { title: 'Final Export & Presentation', duration: '20 mins', order: 4 },
        ]
      }
    ];

    for (const mod of additionalModules) {
      const modId = uuid();
      db.prepare('INSERT INTO "Module" (id, courseId, title, description, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(modId, intensive.id, mod.title, mod.description, mod.order, now, now);
      for (const les of mod.lessons) {
        db.prepare('INSERT INTO "Lesson" (id, moduleId, title, duration, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(uuid(), modId, les.title, les.duration, les.order, now, now);
      }
    }
    console.log('Added 3 more modules to 2-Week Intensive (now 4 total, 13+ lessons)');
  } else {
    console.log('2-Week Intensive already has multiple modules, skipping.');
  }
}

console.log('\nDone! All courses now have rich content.');
