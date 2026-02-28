-- Create Progress tables (capitalized and lowercase) and copy existing data if present

CREATE TABLE IF NOT EXISTS "Progress" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  lessonId TEXT NOT NULL,
  completed INTEGER NOT NULL,
  watchTime INTEGER,
  createdAt TEXT,
  updatedAt TEXT,
  UNIQUE(userId, lessonId)
);

CREATE TABLE IF NOT EXISTS "progress" (
  id TEXT PRIMARY KEY NOT NULL,
  userId TEXT NOT NULL,
  lessonId TEXT NOT NULL,
  completed INTEGER NOT NULL,
  watchTime INTEGER,
  createdAt TEXT,
  updatedAt TEXT,
  UNIQUE(userId, lessonId)
);

-- Copy existing data from capitalized table into lowercase if needed
INSERT INTO "progress" (id, userId, lessonId, completed, watchTime, createdAt, updatedAt)
SELECT id, userId, lessonId, completed, watchTime, createdAt, updatedAt
FROM "Progress"
WHERE NOT EXISTS (SELECT 1 FROM "progress" WHERE id = "Progress".id);
