import { auth as authFn } from "@/aspects/auth";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

await initOpenNextCloudflareForDev();

export const auth = authFn({ gen: true });
