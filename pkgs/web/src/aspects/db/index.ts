import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

export function db() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB);
}

export type Db = ReturnType<typeof db>;
