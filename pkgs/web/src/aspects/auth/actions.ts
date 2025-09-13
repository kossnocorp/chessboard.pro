import { auth } from "@/aspects/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  "use server";
  await auth().api.signOut({ headers: await headers() });
  redirect("/");
}
