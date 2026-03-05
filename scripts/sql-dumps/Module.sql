-- Dump for table: Module

DROP TABLE IF EXISTS "Module";

CREATE TABLE IF NOT EXISTS "Module" (
  "id" text NOT NULL,
  "courseId" text NOT NULL,
  "title" text NOT NULL,
  "position" bigint,
  "createdAt" text,
  "updatedAt" text,
  "description" text,
  "order" bigint DEFAULT 0, PRIMARY KEY ("id")
);


INSERT INTO "Module"("id", "courseId", "title", "position", "createdAt", "updatedAt", "description", "order") VALUES
('349ddf55-51d3-4094-89e7-34fb9a320054', '25188b24-469a-4857-81ef-023f3ae140a2', 'HH', 0, '2026-02-28T21:31:08.543Z', '2026-02-28T21:31:08.543Z', NULL, 0),
('61bfda7a-5995-4766-8c2b-291f01cc657a', '8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', 'Foundation & Setup', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Getting your editing environment ready and understanding the fundamentals.', 1),
('ec47f6e3-ff8a-46b9-ad72-d916912d8099', '8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', 'Core Editing Techniques', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Master the essential cuts, transitions, and timing that define professional work.', 2),
('7aab1ff7-aa7f-4a8f-a5fb-8bde838d29e8', '8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', 'Color & Visual Identity', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Develop your eye for color grading and consistent visual branding.', 3),
('58308cdd-8ff1-44b1-96b0-7f968caea391', '8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', 'Content Strategy & Monetization', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Turn your editing skills into income streams and business opportunities.', 4),
('5640ace1-4357-4e7e-89da-a5511b463eb1', '8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', 'Advanced Techniques & Final Project', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Push your skills with advanced workflows and create your capstone piece.', 5),
('8c1aeb9b-3ab7-47bb-bdca-64602b8c4250', 'f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Getting Started', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Set up your tools and understand the editing landscape.', 1),
('9eeb6ec0-cb76-42c0-9058-d2cd6569250d', 'f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Editing Fundamentals', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Learn the core techniques every editor must know.', 2),
('b8a98fd9-db11-4e41-87e6-61988b41443b', 'f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Audio Editing', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Clean up, mix, and enhance audio in your projects.', 3),
('dc9c33ad-7d0f-43e4-bad2-b7366be9fb0a', 'f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Color Grading Essentials', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Give your videos a professional, polished look.', 4),
('55852073-bd2b-4e41-81f9-60622c5a9e04', 'f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Export & Delivery', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Render and deliver your projects for any platform.', 5),
('4db9cb58-a6e4-4691-972b-993a40316fd7', '6bf44878-d1c8-419d-8a2e-6982a74f938b', 'Timeline Mastery', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Deep dive into timeline workflows and professional editing speed.', 2),
('82b27a80-bd36-47ca-a824-ff8605a48c9d', '6bf44878-d1c8-419d-8a2e-6982a74f938b', 'Sound Design & Audio', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Learn to mix, edit, and enhance audio like a pro.', 3),
('b08a3a66-e0db-46a2-886e-3071426822a7', '6bf44878-d1c8-419d-8a2e-6982a74f938b', 'Portfolio Project', NULL, '2026-03-03T17:10:54.981Z', '2026-03-03T17:10:54.981Z', 'Create a professional-quality edit that showcases your skills.', 4);
