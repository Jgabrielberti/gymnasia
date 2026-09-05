import { sqliteTable, integer, real } from "drizzle-orm/sqlite-core";
import { workoutExercises } from "./workoutExercises";

export const workoutSets = sqliteTable("workout_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: real("weight"),
  durationSeconds: integer("duration_seconds"),
  distanceMeters: real("distance_meters"),
  rir: integer("rir"),
  completed: integer("completed", { mode: "boolean" }).default(true),
});
