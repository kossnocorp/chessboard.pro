"use server";

import { auth } from "@/aspects/auth";
import { db } from "@/aspects/db";
import { visionRecords } from "@/aspects/vision/schema";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { VisionHistoryRecord } from "./history";

type VisionRecordInput = {
  score: number;
  accuracy: number; // 0..1
  time: number; // epoch millis
  // Keep for future; default {} for now
  settings?: Record<string, unknown>;
};

export async function recordVisionResultAction(input: VisionRecordInput) {
  const h = await headers();
  const sessionRes = (await auth().api.getSession({ headers: h })) as any;
  const userId: string | undefined =
    sessionRes?.user?.id ?? sessionRes?.data?.user?.id;
  if (!userId) {
    return { ok: false as const, reason: "not-logged-in" as const };
  }

  const id = crypto.randomUUID();
  const settings = JSON.stringify(input.settings ?? {});
  const accuracyMilli = Math.round((input.accuracy || 0) * 1000);

  await db()
    .insert(visionRecords)
    .values({
      id,
      userId,
      finishedAt: new Date(input.time),
      score: input.score,
      accuracyMilli,
      settings,
      source: "local",
    });

  return { ok: true as const, id };
}

export async function listVisionHistoryAction() {
  const h = await headers();
  const sessionRes = (await auth().api.getSession({ headers: h })) as any;
  const userId: string | undefined =
    sessionRes?.user?.id ?? sessionRes?.data?.user?.id;
  if (!userId)
    return {
      ok: true as const,
      loggedIn: false as const,
      records: [] as Array<{ score: number; time: number; accuracy: number }>,
    };

  const rows = await db()
    .select()
    .from(visionRecords)
    .where(eq(visionRecords.userId, userId))
    .orderBy(asc(visionRecords.finishedAt));

  const records: VisionHistoryRecord[] = rows.map((r) => ({
    score: r.score,
    time: +r.finishedAt,
    accuracy: (r.accuracyMilli ?? 0) / 1000,
  }));

  return { ok: true as const, loggedIn: true as const, records };
}

export async function importVisionHistoryAction(
  records: VisionHistoryRecord[],
) {
  const h = await headers();
  const sessionRes = (await auth().api.getSession({ headers: h })) as any;
  const userId: string | undefined =
    sessionRes?.user?.id ?? sessionRes?.data?.user?.id;
  if (!userId) return { ok: false as const, reason: "not-logged-in" as const };

  const values = (records || []).map((rec) => ({
    id: nanoid(),
    userId,
    finishedAt: new Date(rec.time),
    score: Math.max(0, Math.floor(rec.score || 0)),
    accuracyMilli: Math.max(
      0,
      Math.min(1000, Math.round((rec.accuracy || 0) * 1000)),
    ),
    settings: JSON.stringify({}),
    source: "local" as const,
  }));

  if (values.length === 0) return { ok: true as const, imported: 0 };

  await db().insert(visionRecords).values(values);
  return { ok: true as const, imported: values.length };
}

export async function isAuthenticatedAction() {
  const h = await headers();
  const sessionRes = (await auth().api.getSession({ headers: h })) as any;
  const userId: string | undefined =
    sessionRes?.user?.id ?? sessionRes?.data?.user?.id;
  return { loggedIn: !!userId } as const;
}
