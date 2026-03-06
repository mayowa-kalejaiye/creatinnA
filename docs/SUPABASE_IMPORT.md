Steps to import local SQLite data into Supabase (preferred: paste SQL into Supabase SQL Editor)

1. Prepare
- Ensure you have a Supabase project and you can log in to the Supabase dashboard.
- In this repo `scripts/sql-dumps/` contains generated per-table SQL dumps produced by `scripts/generate_sql_for_supabase.js`.

2. Order of operations
- Open the Supabase project → Database → SQL Editor → New query.
- Run the migration DDL first (if you have a `migrations` or full schema file). If you used `scripts/sql-dumps/` it should contain `schema.sql` or per-table CREATE statements. Execute the schema file(s) first.
- After schema is created, run the per-table INSERT files in this directory. A safe order is:
  1. `users.sql`
  2. `courses.sql` (or `Course.sql`)
  3. `modules.sql` (or `Module.sql`)
  4. `lessons.sql` (or `Lesson.sql`)
  5. `applications.sql`
  6. `enrollments.sql`
  7. `payments.sql`
  8. `progress.sql`
  9. any remaining table dumps

3. Notes / gotchas
- Column names and casing: SQLite dumps may reference quoted names ("Course", "Module"). Supabase/Postgres will accept those, but we've added compatibility by querying lowercase tables in the app where needed.
- Lesson.duration: some existing data stores `duration` as text in SQLite. If you expect an integer in Postgres, inspect `lessons.sql` and convert values or set the column type appropriately before inserting. Example conversion:
  - ALTER TABLE lessons ALTER COLUMN duration TYPE INTEGER USING NULLIF(duration, '')::integer;
  - Or load as text and later run an UPDATE to normalize values.
- Users: `scripts/sql-dumps/users.sql` may contain an admin user entry created for migration convenience. If you want to change the admin credentials, edit that file before import, or create/replace the admin row after import.

4. Alternative: psql/CLI
- You can also run the SQL files from a local machine using `psql` or the `supabase` CLI if you have network access and the DB URL:

  psql "$SUPABASE_DB_URL" -f scripts/sql-dumps/schema.sql
  psql "$SUPABASE_DB_URL" -f scripts/sql-dumps/users.sql
  ...

5. After import
- In the Supabase dashboard verify the tables and row counts (e.g., users, courses, lessons).
- Copy the connection string (URI) from Project Settings → Database → Connection string.

6. Environment
- Set the connection string as `SUPABASE_DB_URL` (or `DATABASE_URL`) in your deployment environment (Vercel). See `docs/VERCEL_SETUP.md` for details.

If you want, I can adapt the SQL dumps (e.g., convert `duration` values) before you import them. Tell me which table/file to adjust.
