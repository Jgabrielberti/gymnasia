import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { workoutTemplates } from "./workoutTemplates";
import { exercises } from "./exercises";

export const workoutTemplateExercises = sqliteTable("workout_template_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutTemplateId: integer("workout_template_id")
    .notNull()
    .references(() => workoutTemplates.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  exerciseOrder: integer("exercise_order").notNull(),
});
