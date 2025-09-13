import { auth } from "@/aspects/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Invalid username");

const emailSchema = z.string().email("Invalid email");
const passwordSchema = z.string().min(1, "Password required");

async function loginAction(formData: FormData) {
  "use server";

  const identifier = (formData.get("identifier") || "").toString().trim();
  const password = passwordSchema.parse(
    (formData.get("password") || "").toString(),
  );

  // Accept email or username. If it's an email, use as-is; otherwise synthesize email from username.
  let email: string;
  if (identifier.includes("@")) {
    email = emailSchema.parse(identifier.toLowerCase());
  } else {
    const username = usernameSchema.parse(identifier.toLowerCase());
    const domain = process.env.NEXT_PUBLIC_DOMAIN || "example.com";
    email = `${username}@${domain}`;
  }

  const res = await auth().api.signInEmail({
    body: { email, password },
    headers: await headers(),
  });

  if (res.error) {
    throw new Error(res.error.message || "Invalid credentials");
  }

  redirect("/");
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      <form action={loginAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email or username</label>
          <input
            required
            name="identifier"
            type="text"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Log in
        </button>
      </form>
    </main>
  );
}
