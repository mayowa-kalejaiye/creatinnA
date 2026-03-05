-- Dump for table: Cohort

DROP TABLE IF EXISTS "Cohort";

CREATE TABLE IF NOT EXISTS "Cohort" (
  "id" text NOT NULL,
  "courseId" text NOT NULL,
  "name" text NOT NULL,
  "capacity" bigint,
  "startDate" text,
  "endDate" text,
  "createdAt" text, PRIMARY KEY ("id")
);

