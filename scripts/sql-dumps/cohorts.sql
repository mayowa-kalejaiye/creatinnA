-- Dump for table: cohorts

DROP TABLE IF EXISTS "cohorts";

CREATE TABLE IF NOT EXISTS "cohorts" (
  "id" text NOT NULL,
  "courseId" text NOT NULL,
  "name" text NOT NULL,
  "capacity" bigint,
  "startDate" text,
  "endDate" text,
  "createdAt" text, PRIMARY KEY ("id")
);

