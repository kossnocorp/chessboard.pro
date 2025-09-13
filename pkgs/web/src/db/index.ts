import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Runtime D1 -> Drizzle adapter for OpenNext Cloudflare
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB);
}

export type DB = ReturnType<typeof getDb>;
