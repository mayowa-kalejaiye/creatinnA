-- Dump for table: lessons

DROP TABLE IF EXISTS "lessons";

CREATE TABLE IF NOT EXISTS "lessons" (
  "id" text NOT NULL,
  "moduleId" text NOT NULL,
  "title" text NOT NULL,
  "content" text,
  "duration" bigint,
  "createdAt" text,
  "updatedAt" text,
  "videoUrl" text,
  "order" bigint DEFAULT 0, PRIMARY KEY ("id")
);


INSERT INTO "lessons"("id", "moduleId", "title", "content", "duration", "createdAt", "updatedAt", "videoUrl", "order") VALUES
('43cde2b1-fe06-465d-9145-85b77445b69e', '349ddf55-51d3-4094-89e7-34fb9a320054', 'UUU', NULL, 'KK MKKK', '2026-02-28T21:31:30.615Z', '2026-02-28T21:31:30.615Z', NULL, 0);
