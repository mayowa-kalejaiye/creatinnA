-- Dump for table: _drizzle_migrations

DROP TABLE IF EXISTS "_drizzle_migrations";

CREATE TABLE IF NOT EXISTS "_drizzle_migrations" (
  "id" text,
  "applied_at" text NOT NULL, PRIMARY KEY ("id")
);


INSERT INTO "_drizzle_migrations"("id", "applied_at") VALUES
('0000_confused_lyja.sql', '2026-01-14T22:16:35.382Z'),
('0001_core_models.sql', '2026-01-14T22:16:35.400Z'),
('0002_lowercase_tables.sql', '2026-01-14T22:26:30.052Z'),
('0003_progress_table.sql', '2026-01-14T22:30:29.237Z');

