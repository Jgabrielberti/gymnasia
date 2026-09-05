import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { exercises } from "./exercises";

export const personalRecords = sqliteTable("personal_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  recordType: text("record_type").notNull(),
  value: real("value").notNull(),
  achievedAt: text("achieved_at").notNull(),
});
