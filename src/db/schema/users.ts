import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, check } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    height: integer("height").notNull(),
    birthDate: text("birth_date").notNull(),
    gender: text("gender", { enum: ["male", "female"] }).notNull(),
    useBiometrics: integer("use_biometrics", { mode: "boolean" }).default(true),
    createdAt: text("created_at").notNull(),
  },
  (table) => [check("gender_check", sql`${table.gender} IN ('male', 'female')`)]
);
