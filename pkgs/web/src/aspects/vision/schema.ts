import { users } from "@/aspects/auth/schema";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const visionRecords = sqliteTable("vision_records", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  score: integer("score").notNull(),

  // Accuracy multiplied by 1000 to avoid floating point in SQLite.
  accuracyMilli: integer("accuracy_milli").notNull(),

  settings: text("settings", { mode: "json" })
    .$type<{}>()
    .notNull()
    .default({}),

  source: text("source").$type<"local" | "server">().notNull().default("local"),

  finishedAt: integer("finished_at", { mode: "timestamp_ms" }).notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .defaultNow()
    .notNull(),

  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
