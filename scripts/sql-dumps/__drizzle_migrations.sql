-- Dump for table: __drizzle_migrations

DROP TABLE IF EXISTS "__drizzle_migrations";

CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
  "id" text,
  "hash" text NOT NULL,
  "created_at" numeric, PRIMARY KEY ("id")
);


INSERT INTO "__drizzle_migrations"("id", "hash", "created_at") VALUES
(NULL, 'e352b19e2c7ba66cc2c64d5310933e7a78a61c0c609c112b8610435951d2e652', 1767829271034);
