import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { meals } from "./meals";
import { foods } from "./foods";

export const nutritionEntries = sqliteTable("nutrition_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  mealId: integer("meal_id")
    .notNull()
    .references(() => meals.id, { onDelete: "cascade" }),
  foodId: integer("food_id")
    .notNull()
    .references(() => foods.id, { onDelete: "cascade" }),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
});
