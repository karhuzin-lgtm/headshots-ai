# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `migrations/001_jobs.sql` in **SQL Editor**.
3. In **Storage**, create two **private** buckets:
   - `uploads` — reference photos from users
   - `generated` — fal.ai outputs (written by the API)
4. Copy **Project URL**, **anon key** (optional for future client use), and **service role key** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (reserved for future)
   - `SUPABASE_SERVICE_ROLE_KEY` (required for API routes)

The app uses the service role only on the server to upload files and update `jobs`.
