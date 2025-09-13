"use client";
// This is a client wrapper to place the server action form anywhere.
// It only renders a button and lets the server action handle cookies.
import React from "react";

export function SignOutForm({ action, label = "Sign out" }: { action: (fd: FormData) => Promise<void>; label?: string }) {
  return (
    <form action={action}>
      <button type="submit" className="text-sm text-gray-600 underline">
        {label}
      </button>
    </form>
  );
}

