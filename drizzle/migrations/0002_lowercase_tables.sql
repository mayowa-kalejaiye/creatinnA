-- Create lowercase tables expected by app code if they don't exist

CREATE TABLE IF NOT EXISTS "courses" (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  price INTEGER,
  duration TEXT,
  level TEXT,
  isPublished INTEGER DEFAULT 0,
  category TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS "enrollments" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  courseId TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  enrolledAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS "modules" (
  id TEXT PRIMARY KEY NOT NULL,
  courseId TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS "lessons" (
  id TEXT PRIMARY KEY NOT NULL,
  moduleId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  duration INTEGER,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS "payments" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT,
  status TEXT,
  provider TEXT,
  providerId TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS "cohorts" (
  id TEXT PRIMARY KEY NOT NULL,
  courseId TEXT NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER,
  startDate TEXT,
  endDate TEXT,
  createdAt TEXT
);

-- If capitalized tables exist, copy data into lowercase tables for compatibility
PRAGMA foreign_keys=OFF;
BEGIN;

-- copy Course -> courses
INSERT INTO "courses" (id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
SELECT id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt
FROM "Course"
WHERE NOT EXISTS(SELECT 1 FROM "courses" WHERE id = "Course".id);

-- copy Enrollment -> enrollments
INSERT INTO "enrollments" (id, userId, courseId, status, progress, enrolledAt, updatedAt)
SELECT id, userId, courseId, status, progress, enrolledAt, updatedAt
FROM "Enrollment"
WHERE NOT EXISTS(SELECT 1 FROM "enrollments" WHERE id = "Enrollment".id);

-- copy Module -> modules
INSERT INTO "modules" (id, courseId, title, position, createdAt, updatedAt)
SELECT id, courseId, title, position, createdAt, updatedAt
FROM "Module"
WHERE NOT EXISTS(SELECT 1 FROM "modules" WHERE id = "Module".id);

-- copy Lesson -> lessons
INSERT INTO "lessons" (id, moduleId, title, content, duration, createdAt, updatedAt)
SELECT id, moduleId, title, content, duration, createdAt, updatedAt
FROM "Lesson"
WHERE NOT EXISTS(SELECT 1 FROM "lessons" WHERE id = "Lesson".id);

-- copy Payment -> payments
INSERT INTO "payments" (id, userId, amount, currency, status, provider, providerId, createdAt)
SELECT id, userId, amount, currency, status, provider, providerId, createdAt
FROM "Payment"
WHERE NOT EXISTS(SELECT 1 FROM "payments" WHERE id = "Payment".id);

-- copy Cohort -> cohorts
INSERT INTO "cohorts" (id, courseId, name, capacity, startDate, endDate, createdAt)
SELECT id, courseId, name, capacity, startDate, endDate, createdAt
FROM "Cohort"
WHERE NOT EXISTS(SELECT 1 FROM "cohorts" WHERE id = "Cohort".id);

COMMIT;
PRAGMA foreign_keys=ON;
