import { asc } from "drizzle-orm";
import { db } from "@/src/db";
import { workouts, workoutExercises, workoutSets } from "@/src/db/schema";

export type StructuredSet = {
  reps: number;
  weight: number;
  rir: number | null;
  completed: boolean | null;
};

export type StructuredExercise = {
  exerciseId: number;
  sets: StructuredSet[];
};

export type SaveStructuredWorkoutParams = {
  userId: number;
  workout_date: Date;
  title: string;
  description: string;
  exercises: StructuredExercise[];
};

export type SaveRawWorkoutParams = {
  userId: number;
  workout_date: Date;
  title: string;
  content: string;
};

export const WorkoutRepository = {
  async getTrainingDays(): Promise<string[]> {
    try {
      const rows = await db
        .selectDistinct({ workoutDate: workouts.workoutDate })
        .from(workouts)
        .orderBy(asc(workouts.workoutDate));

      return rows.map((row) => row.workoutDate);
    } catch (error) {
      console.error("Erro ao buscar dias de treino:", error);
      return [];
    }
  },

  async saveStructured(data: SaveStructuredWorkoutParams): Promise<number> {
    let newWorkoutId = 0;

    await db.transaction(async (tx) => {
      const formattedWorkoutDate = data.workout_date.toString().split("T")[0];

      const insertedWorkout = await tx
        .insert(workouts)
        .values({
          userId: data.userId,
          workoutDate: formattedWorkoutDate,
          title: data.title.trim(),
          description: data.description.trim(),
        })
        .returning({ id: workouts.id });

      newWorkoutId = insertedWorkout[0].id;

      for (const exercise of data.exercises) {
        const insertedExercise = await tx
          .insert(workoutExercises)
          .values({
            workoutId: newWorkoutId,
            exerciseId: exercise.exerciseId,
          })
          .returning({ id: workoutExercises.id });

        const workoutExerciseId = insertedExercise[0].id;

        if (exercise.sets.length > 0) {
          await tx.insert(workoutSets).values(
            exercise.sets.map((set, index) => ({
              workoutExerciseId,
              setNumber: index + 1,
              reps: set.reps,
              weight: set.weight,
              rir: set.rir,
              completed: Boolean(set.completed),
            })),
          );
        }
      }
    });

    return newWorkoutId;
  },
};
