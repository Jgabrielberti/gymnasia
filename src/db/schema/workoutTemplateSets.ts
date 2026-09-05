import { sqliteTable, integer, real } from "drizzle-orm/sqlite-core";
import { workoutTemplateExercises } from "./workoutTemplateExercises";

export const workoutTemplateSets = sqliteTable("workout_template_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutTemplateExerciseId: integer("workout_template_exercise_id")
    .notNull()
    .references(() => workoutTemplateExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: real("weight"),
  rir: integer("rir"),
});
