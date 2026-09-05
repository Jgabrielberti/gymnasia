import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { workouts } from "./workouts";

export const rawWorkoutLogs = sqliteTable("raw_workout_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  lastEditedAt: text("last_edited_at").notNull(),
});
