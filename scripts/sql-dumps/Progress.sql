-- Dump for table: Progress

DROP TABLE IF EXISTS "Progress";

CREATE TABLE IF NOT EXISTS "Progress" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "lessonId" text NOT NULL,
  "completed" bigint NOT NULL,
  "watchTime" bigint,
  "createdAt" text,
  "updatedAt" text, PRIMARY KEY ("id")
);


INSERT INTO "Progress"("id", "userId", "lessonId", "completed", "watchTime", "createdAt", "updatedAt") VALUES
('f18a2e75-d643-4253-9527-0441c1db1e35', '9a491fb0-5421-459d-b3bb-3956f8290bfe', '66555c04-8f32-4621-ba76-3627e2d15f9f', 1, 0, '2026-03-03T18:26:56.772Z', '2026-03-03T18:26:56.772Z');
