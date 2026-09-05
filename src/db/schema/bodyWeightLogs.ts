import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const bodyWeightLogs = sqliteTable("body_weight_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weight: real("weight"),
  bodyFatPercentage: real("body_fat_percentage"),
  measuredAt: text("measured_at"),
});
