-- Dump for table: Course

DROP TABLE IF EXISTS "Course";

CREATE TABLE IF NOT EXISTS "Course" (
  "id" text NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "description" text,
  "thumbnail" text,
  "price" bigint,
  "duration" text,
  "level" text,
  "isPublished" bigint DEFAULT 0,
  "category" text,
  "createdAt" text,
  "updatedAt" text, PRIMARY KEY ("id")
);


INSERT INTO "Course"("id", "title", "slug", "description", "thumbnail", "price", "duration", "level", "isPublished", "category", "createdAt", "updatedAt") VALUES
('6bf44878-d1c8-419d-8a2e-6982a74f938b', '2-Week Video Editing Intensive', '2-week-video-editing-intensive', 'Our flagship 2-Week Video Editing Intensive is a physically-held, mentor-led program designed for aspiring editors who want to learn professional-grade video editing in an accelerated, disciplined environment.

Only 3 students are admitted per cohort — ensuring each student gets direct, hands-on guidance from our senior editors. You''ll move through real-world projects, master industry-standard tools, and build a portfolio piece by the end of the program.

This is not a casual workshop. It is a structured, selective training built for people who are serious about developing a marketable creative skill.', '/uploads/1772547416776-Vandah2.png', 100000, '2 weeks', 'Beginner', 1, 'Video Editing', '2026-02-28T19:43:10.958Z', '2026-03-03T17:10:54.981Z'),
('8e8d78e9-bc65-4ab0-bec2-daa62e8a2c58', '1-on-1 Mastery Track', '1-on-1-mastery-track', 'The 1-on-1 Mastery Track is our highest-touch offering — a private mentorship designed for busy professionals, entrepreneurs, and creators who need flexibility without sacrificing depth.

You''ll work directly with a senior CreatINN mentor on a schedule that fits your life. Sessions are tailored to your skill level, your goals, and the kind of content you want to create or monetize.

This track covers everything from technical editing skills to creative direction, content strategy, and monetization thinking. It''s not just about learning software — it''s about learning to think like a professional creative.

Ideal for professionals who want elite-level skills without the cohort format.', '/uploads/1772614760981-IMG_2621__1_.jpg', 600000, 'Flexible', 'Advanced', 1, 'Video Editing', '2026-02-28T19:43:10.958Z', '2026-03-04T08:59:26.663Z'),
('f00eaf2a-15c3-47a2-be2a-65a34c16f2d6', 'Online Video Editing', 'online-video-editing', 'The Online Video Editing Course is a self-paced digital program that teaches you the fundamentals of professional video editing from anywhere in the world.

You''ll learn through structured video lessons, practical exercises, and downloadable resources — all accessible on your own schedule. The course covers timeline editing, color grading, audio mixing, transitions, effects, and export workflows.

This course is designed for self-starters who want practical skills at an accessible price point. Note: this track does not include mentorship or alumni status — it is a skill-building course only.', '/uploads/1772614939200-IMG_0965-1200.webp', 30000, 'Self-paced', 'Beginner', 1, 'Video Editing', '2026-02-28T19:43:10.958Z', '2026-03-04T09:02:21.749Z');
