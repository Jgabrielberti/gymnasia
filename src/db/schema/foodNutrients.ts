import { sqliteTable, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { foods } from "./foods";
import { micronutrients } from "./micronutrients";

export const foodNutrients = sqliteTable(
  "food_nutrients",
  {
    foodId: integer("food_id")
      .notNull()
      .references(() => foods.id, { onDelete: "cascade" }),
    micronutrientId: integer("micronutrient_id")
      .notNull()
      .references(() => micronutrients.id, { onDelete: "cascade" }),
    amountPer100g: real("amount_per_100g").notNull(),
  },
  (table) => [primaryKey({ columns: [table.foodId, table.micronutrientId] })]
);
