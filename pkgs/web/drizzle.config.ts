import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!accountId) throw new Error("Missing CLOUDFLARE_ACCOUNT_ID env var");
const databaseId =
  process.env.CLOUDFLARE_D1_DATABASE_ID ??
  "c3237761-53b9-4959-9e4b-fba8d1e2a27f"; // NOTE: Default, keep in sync with ./wrangler.toml
if (!databaseId) throw new Error("Missing CLOUDFLARE_D1_DATABASE_ID env var");
const token = process.env.CLOUDFLARE_D1_TOKEN;
if (!token) throw new Error("Missing CLOUDFLARE_D1_TOKEN env var");

export default defineConfig({
  schema: "./src/aspects/db/schema.ts",
  out: "./src/aspects/db/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: { accountId, databaseId, token },
  verbose: true,
  strict: true,
});
