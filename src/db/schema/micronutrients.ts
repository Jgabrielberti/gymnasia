import { sqliteTable, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const micronutrients = sqliteTable(
  "micronutrients",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    unit: text("unit").notNull(),
  },
  (table) => [uniqueIndex("micronutrients_name_unique").on(table.name)]
);
