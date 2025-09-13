import { auth } from "@/aspects/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
    "Use letters, numbers and hyphens only",
  );

const emailSchema = z.string().email("Enter a valid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
const nameSchema = z.string().min(1, "Name is required");

async function joinAction(formData: FormData) {
  "use server";

  const username = usernameSchema.parse(
    (formData.get("username") || "").toString().toLowerCase(),
  );
  const email = emailSchema.parse(
    (formData.get("email") || "").toString().toLowerCase(),
  );
  const name = nameSchema.parse((formData.get("name") || "").toString());
  const password = passwordSchema.parse(
    (formData.get("password") || "").toString(),
  );
  const confirm = (formData.get("confirm") || "").toString();
  if (password !== confirm) {
    throw new Error("Passwords do not match");
  }

  const res = await auth().api.signUpEmail({
    body: {
      email,
      password,
      name,
      // With the username plugin enabled, this sets the user's username.
      username,
    },
    headers: await headers(),
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to create account");
  }

  redirect("/");
}

export default function JoinPage() {
  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
      <form action={joinAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            required
            name="username"
            type="text"
            placeholder="your-name"
            className="border rounded px-3 py-2 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lowercase letters, numbers, hyphens.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            required
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            required
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            required
            name="password"
            type="password"
            autoComplete="new-password"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm password</label>
          <input
            required
            name="confirm"
            type="password"
            autoComplete="new-password"
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Join
        </button>
      </form>
    </main>
  );
}
