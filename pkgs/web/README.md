This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration (OpenNext)

This app is configured for Cloudflare Workers via the OpenNext Cloudflare adapter.

Scripts:

- `preview`: `opennextjs-cloudflare build && opennextjs-cloudflare preview`
- `deploy`: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`
- `upload`: `opennextjs-cloudflare build && opennextjs-cloudflare upload`
- `cf-typegen`: Generate types for bindings into `env.d.ts`

Config:

- Wrangler config is in `wrangler.toml` (TOML, not JSONC)
- Build output is in `.open-next/` (gitignored)
- Optional static cache headers are in `public/_headers`
- For local dev bindings, `next.config.mjs` calls `initOpenNextCloudflareForDev()`

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, preview, and in production:

- Dev: automatically available via `initOpenNextCloudflareForDev()`
- Preview/Deploy: add bindings in `wrangler.toml` (e.g., KV, R2, D1, DO, AI)

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:

- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it.
- Do the same in the `wrangler.toml` file, where
  the comment is:
  ```
  # KV Example:
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
