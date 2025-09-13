import { db } from "@/aspects/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import * as schema from "./schema";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL;

export namespace Auth {
  export interface Props {
    /* If to run in gen mode and skip actual database resolve. */
    gen?: boolean;
  }
}

export function auth(props: Auth.Props = {}) {
  return betterAuth({
    baseURL,

    emailAndPassword: {
      enabled: true,
    },

    plugins: [username(), nextCookies()],

    database: drizzleAdapter(props.gen ? {} : db(), {
      provider: "sqlite",
      usePlural: true,
      schema,
    }),
  });
}
