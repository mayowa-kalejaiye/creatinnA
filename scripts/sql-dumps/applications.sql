-- Dump for table: applications

DROP TABLE IF EXISTS "applications";

CREATE TABLE IF NOT EXISTS "applications" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "program" text NOT NULL,
  "status" text NOT NULL,
  "experience" text NOT NULL,
  "motivation" text NOT NULL,
  "commitment" bigint NOT NULL,
  "submittedAt" text NOT NULL,
  "notes" text, PRIMARY KEY ("id")
);


INSERT INTO "applications"("id", "userId", "program", "status", "experience", "motivation", "commitment", "submittedAt", "notes") VALUES
('4ee2b9b1-35e7-4e82-bae6-d2e8cc54359e', '9a491fb0-5421-459d-b3bb-3956f8290bfe', 'intensive', 'activated', 'Film', 'Film', 1, '2026-03-03T18:07:24.173Z', NULL);
