This document is intentionally minimal. Reserved for future notes and guidelines on how agents (human or automated) should operate in this repo.

# Cloudflare

## Workers

### Types

- To generate types, run: `pnpm --filter @chessboard.pro/web run cf-typegen`
- **Always** regenerate types after changing `wrangler.toml` or upgrading `wrangler`.
- Prefer `wrangler types` over `@cloudflare/workers-types` to generate types based on the compatibility date and flags. See the [npm package notice](https://www.npmjs.com/package/@cloudflare/workers-types).
