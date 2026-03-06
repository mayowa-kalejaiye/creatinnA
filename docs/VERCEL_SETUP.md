Vercel environment variables and deployment checklist

1. Required environment variables (set these in your Vercel Project → Settings → Environment Variables)
- `SUPABASE_DB_URL` = Postgres connection string (URI) from Supabase Project → Settings → Database → Connection string. Example: `postgres://user:password@db.host.supabase.co:5432/postgres`
- OR set `DATABASE_URL` = the same Postgres URI (the app checks both). Use whichever you prefer; setting both is also fine.

- `NODE_ENV` = `production` (Vercel sets this automatically during builds)
- `NEXT_PUBLIC_BASE_URL` = your site URL, e.g. `https://your-site.com` (used for payment callbacks)
- `PAYSTACK_SECRET_KEY` = (only if you use Paystack for payments)

2. Optional but useful during migration
- `USE_SUPABASE` = `1` (forces Postgres usage even in non-production environments; useful for staging/testing)
- `ADMIN_BACKDOOR_EMAIL` and `ADMIN_BACKDOOR_PASSWORD` = one-time admin backdoor values used only for emergency access during migration. Remove or rotate these after launch.

3. Deploy steps
- Import your SQL into Supabase (see `docs/SUPABASE_IMPORT.md`).
- In Vercel, add the environment variables above (set them for both "Preview" and "Production" as needed).
- Trigger a Vercel deployment (either via Git push or the Vercel dashboard).
- After deployment, verify the app can connect to the database and that core pages (admin, dashboard, course pages) load without server errors.

4. Post-deploy sanity checks
- Visit `/api/dashboard` (or other API routes) to verify DB-driven responses.
- Verify payments flow if `PAYSTACK_SECRET_KEY` is set (test mode or manual webhook flow).
- Once Postgres is confirmed working in production, consider removing the sqlite fallback code in `lib/prisma.ts` if you no longer need it.

5. Troubleshooting
- If the app shows database connection errors, check that `SUPABASE_DB_URL` is a valid Postgres URI and that the Vercel network has access (Supabase is publicly accessible; no additional VPC settings required).
- If TLS or SSL is required, confirm the connection string includes the correct parameters. The `pg` client used by the app will typically work with the standard Supabase connection URI.

If you want, I can generate a Vercel environment variable checklist you can paste into the Vercel dashboard or prepare a one-click deployment template.
