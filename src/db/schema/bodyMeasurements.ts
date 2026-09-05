import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const bodyMeasurements = sqliteTable("body_measurements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  chest: real("chest"),
  waist: real("waist"),
  hips: real("hips"),
  leftArm: real("left_arm"),
  rightArm: real("right_arm"),
  leftThigh: real("left_thigh"),
  rightThigh: real("right_thigh"),
  measuredAt: text("measured_at"),
});
