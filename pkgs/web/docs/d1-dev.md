Local D1 in Next.js Dev (OpenNext Cloudflare)

If you see SQLITE_CANTOPEN during auth/database calls, your local D1 file likely doesn’t exist yet or tables haven’t been applied.

Option A — Use local D1 (recommended for offline)

1) Ensure the state dir exists (plugin creates it): `pkgs/web/.wrangler/state/v3/d1/`
2) Apply migrations locally (uses migrations_dir from wrangler.toml):

   pnpm -C pkgs/web dlx wrangler d1 migrations apply chessboard-web --local

   Alternatively, execute a specific SQL file:

   pnpm -C pkgs/web dlx wrangler d1 execute chessboard-web --local --file=src/aspects/db/migrations/0000_nosy_redwing.sql

3) Start dev: `pnpm -C pkgs/web dev`

4) Open Drizzle Studio against local D1 (optional):

   pnpm -C pkgs/web db/studio:local

   Notes:
   - Studio looks for the first `.sqlite` file under `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/`.
   - If discovery fails, set an explicit path:
     
       D1_LOCAL_PATH=pkgs/web/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<your>.sqlite pnpm -C pkgs/web db/studio:local

Option B — Use remote D1 in dev (needs Wrangler auth)

1) Login once: `pnpm -C pkgs/web dlx wrangler login`
2) Add to `wrangler.toml` under your `[[d1_databases]]` binding:

   experimental_remote = true

3) Enable remote bindings in dev by passing the flag when initializing in `next.config.mjs` if supported by your version of @opennextjs/cloudflare.

Notes

- `users.name` is now optional (nullable). If you applied the first migration already, run a new push to alter the column:

  pnpm -C pkgs/web run db:push   # remote D1 via d1-http
  pnpm -C pkgs/web dlx wrangler d1 migrations apply chessboard-web --local

- Local DB files live under `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/`.

Drizzle Studio (remote dev DB)

- If you prefer using your remote dev D1 via HTTP driver:

  pnpm -C pkgs/web db/studio

  Ensure `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_D1_TOKEN` are available in the environment.
