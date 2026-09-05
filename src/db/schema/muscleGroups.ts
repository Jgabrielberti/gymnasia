import { sqliteTable, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const muscleGroups = sqliteTable(
  "muscle_groups",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
  },
  (table) => [uniqueIndex("muscle_groups_name_unique").on(table.name)]
);
