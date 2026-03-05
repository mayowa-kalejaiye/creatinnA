-- Dump for table: users

DROP TABLE IF EXISTS "users";

CREATE TABLE IF NOT EXISTS "users" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "phone" text,
  "createdAt" text,
  "updatedAt" text,
  "role" text DEFAULT 'APPLICANT', PRIMARY KEY ("id")
);


INSERT INTO "users"("id", "name", "email", "password", "phone", "createdAt", "updatedAt", "role") VALUES
('9a491fb0-5421-459d-b3bb-3956f8290bfe', 'Mayowa Kalejaiye', 'kalejaiyemayowa3@gmail.com', '$2b$10$HyfMJEQdO3yMP2cJIOCLBO2fRZLeC2NDMES8v01LzjNUgEOicNw3.', '+2348074944583', '2026-03-03T18:07:24.173Z', '2026-03-03T18:20:39.990Z', 'STUDENT'),
('f10dd536-1279-4d16-9dae-6e5d1ef4be2e', 'Administrator', 'admin@creatinn.academy', '$2b$10$CohSzBqpuFsS0ICCl30kqOcn5jyV2cp46kvigUpQHLuTU2jdlDj3K', NULL, '2026-03-03T19:37:41.613Z', '2026-03-03T19:37:41.613Z', 'ADMIN');
