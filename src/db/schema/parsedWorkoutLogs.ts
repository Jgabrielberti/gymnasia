import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { workouts } from "./workouts";

export const parsedWorkoutLogs = sqliteTable("parsed_workout_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  parserVersion: text("parser_version"),
  parsedJson: text("parsed_json").notNull(),
  parsedAt: text("parsed_at").notNull(),
});
