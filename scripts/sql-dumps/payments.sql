-- Dump for table: payments

DROP TABLE IF EXISTS "payments";

CREATE TABLE IF NOT EXISTS "payments" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "amount" bigint NOT NULL,
  "currency" text,
  "status" text,
  "provider" text,
  "providerId" text,
  "createdAt" text, PRIMARY KEY ("id")
);

