import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, check } from "drizzle-orm/sqlite-core";
import { exercises } from "./exercises";
import { muscleGroups } from "./muscleGroups";

export const exerciseMuscleGroups = sqliteTable(
  "exercise_muscle_groups",
  {
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscleGroupId: integer("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["primary", "secondary"] }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.exerciseId, table.muscleGroupId, table.role] }),
    check("role_check", sql`${table.role} IN ('primary', 'secondary')`),
  ]
);
