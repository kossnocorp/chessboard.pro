import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Enable Cloudflare bindings during local development when running `next dev`.
if (process.env.NODE_ENV === "development") {
  await initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
