import { relations } from "drizzle-orm";
import { users } from "./users";
import { bodyMeasurements } from "./bodyMeasurements";
import { bodyWeightLogs } from "./bodyWeightLogs";
import { exercises } from "./exercises";
import { muscleGroups } from "./muscleGroups";
import { exerciseMuscleGroups } from "./exerciseMuscleGroups";
import { foods } from "./foods";
import { micronutrients } from "./micronutrients";
import { foodNutrients } from "./foodNutrients";
import { meals } from "./meals";
import { nutritionEntries } from "./nutritionEntries";
import { personalRecords } from "./personalRecords";
import { workouts } from "./workouts";
import { workoutExercises } from "./workoutExercises";
import { workoutSets } from "./workoutSets";
import { rawWorkoutLogs } from "./rawWorkoutLogs";
import { parsedWorkoutLogs } from "./parsedWorkoutLogs";
import { workoutTemplateFolders } from "./workoutTemplateFolders";
import { workoutTemplates } from "./workoutTemplates";
import { workoutTemplateExercises } from "./workoutTemplateExercises";
import { workoutTemplateSets } from "./workoutTemplateSets";

export const usersRelations = relations(users, ({ many }) => ({
  bodyMeasurements: many(bodyMeasurements),
  bodyWeightLogs: many(bodyWeightLogs),
  meals: many(meals),
  personalRecords: many(personalRecords),
  workouts: many(workouts),
  workoutTemplateFolders: many(workoutTemplateFolders),
  workoutTemplates: many(workoutTemplates),
}));

export const bodyMeasurementsRelations = relations(bodyMeasurements, ({ one }) => ({
  user: one(users, { fields: [bodyMeasurements.userId], references: [users.id] }),
}));

export const bodyWeightLogsRelations = relations(bodyWeightLogs, ({ one }) => ({
  user: one(users, { fields: [bodyWeightLogs.userId], references: [users.id] }),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  muscleGroups: many(exerciseMuscleGroups),
  workoutExercises: many(workoutExercises),
  personalRecords: many(personalRecords),
  workoutTemplateExercises: many(workoutTemplateExercises),
}));

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  exercises: many(exerciseMuscleGroups),
}));

export const exerciseMuscleGroupsRelations = relations(exerciseMuscleGroups, ({ one }) => ({
  exercise: one(exercises, { fields: [exerciseMuscleGroups.exerciseId], references: [exercises.id] }),
  muscleGroup: one(muscleGroups, { fields: [exerciseMuscleGroups.muscleGroupId], references: [muscleGroups.id] }),
}));

export const foodsRelations = relations(foods, ({ many }) => ({
  nutrients: many(foodNutrients),
  nutritionEntries: many(nutritionEntries),
}));

export const micronutrientsRelations = relations(micronutrients, ({ many }) => ({
  foods: many(foodNutrients),
}));

export const foodNutrientsRelations = relations(foodNutrients, ({ one }) => ({
  food: one(foods, { fields: [foodNutrients.foodId], references: [foods.id] }),
  micronutrient: one(micronutrients, { fields: [foodNutrients.micronutrientId], references: [micronutrients.id] }),
}));

export const mealsRelations = relations(meals, ({ one, many }) => ({
  user: one(users, { fields: [meals.userId], references: [users.id] }),
  nutritionEntries: many(nutritionEntries),
}));

export const nutritionEntriesRelations = relations(nutritionEntries, ({ one }) => ({
  meal: one(meals, { fields: [nutritionEntries.mealId], references: [meals.id] }),
  food: one(foods, { fields: [nutritionEntries.foodId], references: [foods.id] }),
}));

export const personalRecordsRelations = relations(personalRecords, ({ one }) => ({
  user: one(users, { fields: [personalRecords.userId], references: [users.id] }),
  exercise: one(exercises, { fields: [personalRecords.exerciseId], references: [exercises.id] }),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, { fields: [workouts.userId], references: [users.id] }),
  workoutExercises: many(workoutExercises),
  rawLogs: many(rawWorkoutLogs),
  parsedLogs: many(parsedWorkoutLogs),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, { fields: [workoutExercises.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [workoutExercises.exerciseId], references: [exercises.id] }),
  sets: many(workoutSets),
}));

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  workoutExercise: one(workoutExercises, { fields: [workoutSets.workoutExerciseId], references: [workoutExercises.id] }),
}));

export const rawWorkoutLogsRelations = relations(rawWorkoutLogs, ({ one }) => ({
  workout: one(workouts, { fields: [rawWorkoutLogs.workoutId], references: [workouts.id] }),
}));

export const parsedWorkoutLogsRelations = relations(parsedWorkoutLogs, ({ one }) => ({
  workout: one(workouts, { fields: [parsedWorkoutLogs.workoutId], references: [workouts.id] }),
}));

export const workoutTemplateFoldersRelations = relations(workoutTemplateFolders, ({ one, many }) => ({
  user: one(users, { fields: [workoutTemplateFolders.userId], references: [users.id] }),
  templates: many(workoutTemplates),
}));

export const workoutTemplatesRelations = relations(workoutTemplates, ({ one, many }) => ({
  user: one(users, { fields: [workoutTemplates.userId], references: [users.id] }),
  folder: one(workoutTemplateFolders, { fields: [workoutTemplates.folderId], references: [workoutTemplateFolders.id] }),
  templateExercises: many(workoutTemplateExercises),
}));

export const workoutTemplateExercisesRelations = relations(workoutTemplateExercises, ({ one, many }) => ({
  template: one(workoutTemplates, { fields: [workoutTemplateExercises.workoutTemplateId], references: [workoutTemplates.id] }),
  exercise: one(exercises, { fields: [workoutTemplateExercises.exerciseId], references: [exercises.id] }),
  sets: many(workoutTemplateSets),
}));

export const workoutTemplateSetsRelations = relations(workoutTemplateSets, ({ one }) => ({
  templateExercise: one(workoutTemplateExercises, {
    fields: [workoutTemplateSets.workoutTemplateExerciseId],
    references: [workoutTemplateExercises.id],
  }),
}));
