-- Dump for table: Payment

DROP TABLE IF EXISTS "Payment";

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "amount" bigint NOT NULL,
  "currency" text,
  "status" text,
  "provider" text,
  "providerId" text,
  "createdAt" text, PRIMARY KEY ("id")
);

