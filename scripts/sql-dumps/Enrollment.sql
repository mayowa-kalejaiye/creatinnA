-- Dump for table: Enrollment

DROP TABLE IF EXISTS "Enrollment";

CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "courseId" text NOT NULL,
  "status" text NOT NULL,
  "progress" bigint DEFAULT 0,
  "enrolledAt" text,
  "updatedAt" text, PRIMARY KEY ("id")
);


INSERT INTO "Enrollment"("id", "userId", "courseId", "status", "progress", "enrolledAt", "updatedAt") VALUES
('dfa36633-abf3-4c52-9a9d-489e62fa8627', '9a491fb0-5421-459d-b3bb-3956f8290bfe', '6bf44878-d1c8-419d-8a2e-6982a74f938b', 'active', 0, '2026-03-03T18:20:39.991Z', '2026-03-03T18:20:39.991Z');
