-- Dump for table: modules

DROP TABLE IF EXISTS "modules";

CREATE TABLE IF NOT EXISTS "modules" (
  "id" text NOT NULL,
  "courseId" text NOT NULL,
  "title" text NOT NULL,
  "position" bigint,
  "createdAt" text,
  "updatedAt" text,
  "description" text,
  "order" bigint DEFAULT 0, PRIMARY KEY ("id")
);


INSERT INTO "modules"("id", "courseId", "title", "position", "createdAt", "updatedAt", "description", "order") VALUES
('349ddf55-51d3-4094-89e7-34fb9a320054', '25188b24-469a-4857-81ef-023f3ae140a2', 'HH', 0, '2026-02-28T21:31:08.543Z', '2026-02-28T21:31:08.543Z', NULL, 0);
