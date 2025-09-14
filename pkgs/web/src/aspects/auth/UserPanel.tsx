import Link from "next/link";
import { auth } from "@/aspects/auth";
import { headers } from "next/headers";
import { signOutAction } from "@/aspects/auth/actions";

export default async function UserPanel() {
  const h = await headers();
  const res = (await auth().api.getSession({ headers: h })) as any;
  const user = res?.user ?? res?.data?.user;
  const display = user?.username || user?.email || user?.name;

  return (
    <div className="w-full border-b border-neutral-800/60 bg-black/20">
      <div className="mx-auto max-w-5xl px-3 py-2 text-xs text-neutral-400 flex items-center justify-end gap-3">
        {user ? (
          <>
            <span className="truncate max-w-[40ch]" title={display}>
              {display}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="hover:text-neutral-200 transition-colors"
                title="Sign out"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="hover:text-neutral-200 transition-colors"
            >
              Login
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href="/join"
              className="hover:text-neutral-200 transition-colors"
            >
              Join
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

