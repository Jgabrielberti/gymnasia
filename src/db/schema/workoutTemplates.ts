import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { workoutTemplateFolders } from "./workoutTemplateFolders";

export const workoutTemplates = sqliteTable("workout_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  folderId: integer("folder_id").notNull().references(() => workoutTemplateFolders.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  totalSets: integer("total_sets").notNull(),
  createdAt: text("created_at").notNull(),
});
