-- Dump for table: enrollments

DROP TABLE IF EXISTS "enrollments";

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "courseId" text NOT NULL,
  "status" text NOT NULL,
  "progress" bigint DEFAULT 0,
  "enrolledAt" text,
  "updatedAt" text, PRIMARY KEY ("id")
);

