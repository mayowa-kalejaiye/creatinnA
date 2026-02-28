-- Add role to users
ALTER TABLE "users" ADD COLUMN role TEXT DEFAULT 'APPLICANT';

-- Courses
CREATE TABLE IF NOT EXISTS "Course" (
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

-- Enrollment
CREATE TABLE IF NOT EXISTS "Enrollment" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  courseId TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  enrolledAt TEXT,
  updatedAt TEXT
);

-- Module
CREATE TABLE IF NOT EXISTS "Module" (
  id TEXT PRIMARY KEY NOT NULL,
  courseId TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER,
  createdAt TEXT,
  updatedAt TEXT
);

-- Lesson
CREATE TABLE IF NOT EXISTS "Lesson" (
  id TEXT PRIMARY KEY NOT NULL,
  moduleId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  duration INTEGER,
  createdAt TEXT,
  updatedAt TEXT
);

-- Payment
CREATE TABLE IF NOT EXISTS "Payment" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT,
  status TEXT,
  provider TEXT,
  providerId TEXT,
  createdAt TEXT
);

-- Cohort
CREATE TABLE IF NOT EXISTS "Cohort" (
  id TEXT PRIMARY KEY NOT NULL,
  courseId TEXT NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER,
  startDate TEXT,
  endDate TEXT,
  createdAt TEXT
);
