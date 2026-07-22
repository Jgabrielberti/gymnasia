import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
  "users", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  username: text("name").notNull(),

  height: integer("height"),

  age: integer("age"),

  useBiometrics: integer("use_biometrics", {
    mode: "boolean",
  }).default(true),

  createdAt: text("created_at").notNull(),
});


export const exercises = sqliteTable(
  "exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  category: text("category"),

  createdAt: text("created_at").notNull(),
});

export const muscleGroups = sqliteTable(
  "muscle_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull().unique(),
});

export const exerciseMuscleGroups = sqliteTable(
  "exercise_muscle_groups",
  {
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id),

    muscleGroupId: integer("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.exerciseId, table.muscleGroupId],
    }),
  })
);

export const workouts = sqliteTable(
  "workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  workoutDate: text("workout_date").notNull(),

  notes: text("notes"),
});

export const workoutExercises = sqliteTable(
  "workout_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id),

  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id),
});

export const workoutSets = sqliteTable(
  "workout_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id),

  setNumber: integer("set_number").notNull(),

  reps: integer("reps"),

  weight: real("weight"),

  durationSeconds: integer("duration_seconds"),

  distanceMeters: real("distance_meters"),

  rir: integer("rir"),

  completed: integer("completed", {
    mode: "boolean",
  }).default(true),
});

export const workoutTemplates = sqliteTable(
  "workout_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  name: text("name").notNull(),

  description: text("description"),

  createdAt: text("created_at").notNull(),
});

export const workoutTemplateExercises = sqliteTable(
  "workout_template_exercises",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    workoutTemplateId: integer("workout_template_id")
      .notNull()
      .references(() => workoutTemplates.id),

    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id),

    exerciseOrder: integer("exercise_order").notNull(),
  }
);

export const meals = sqliteTable(
  "meals", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  mealTime: text("meal_time").notNull(),

  mealName: text("meal_name"),
});

export const micronutrients = sqliteTable(
  "micronutrients", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name")
    .notNull()
    .unique(),

  unit: text("unit").notNull(),
});

export const foods = sqliteTable(
  "foods", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  brand: text("brand"),
});

export const foodNutrients = sqliteTable(
  "food_nutrients",
  {
    foodId: integer("food_id")
      .notNull()
      .references(() => foods.id),

    micronutrientId: integer("micronutrient_id")
      .notNull()
      .references(() => micronutrients.id),

    amountPer100g: real("amount_per_100g").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.foodId, table.micronutrientId],
    }),
  })
);

export const nutritionEntries = sqliteTable(
  "nutrition_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  mealId: integer("meal_id")
    .notNull()
    .references(() => meals.id),

  foodId: integer("food_id")
    .notNull()
    .references(() => foods.id),

  quantity: real("quantity").notNull(),

  unit: text("unit").notNull(),
});

export const bodyWeightLogs = sqliteTable(
  "body_weight_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  weight: real("weight"),

  bodyFatPercentage: real("body_fat_percentage"),

  measuredAt: text("measured_at"),
});

export const bodyMeasurements = sqliteTable(
  "body_measurements", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  chest: real("chest"),

  waist: real("waist"),

  hips: real("hips"),

  leftArm: real("left_arm"),

  rightArm: real("right_arm"),

  leftThigh: real("left_thigh"),

  rightThigh: real("right_thigh"),

  measuredAt: text("measured_at"),
});

export const personalRecords = sqliteTable(
  "personal_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id),

  recordType: text("record_type").notNull(),

  value: real("value").notNull(),

  achievedAt: text("achieved_at").notNull(),
});