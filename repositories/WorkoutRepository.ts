import { db } from "@/db";

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
      const trainingDays = await db.getAllAsync<{ workout_date: string }>(
        `SELECT DISTINCT workout_date FROM workouts ORDER BY workout_date ASC`
      );
      return trainingDays.map((day) => day.workout_date);
    } catch (error) {
      console.error("Erro ao buscar dias de treino:", error);
      return [];
    }
  },

  async saveStructured(data: SaveStructuredWorkoutParams): Promise<number> {
    let newWorkoutId = 0;
    
    await db.withTransactionAsync(async () => {
      const formattedworkout_date = data.workout_date.toString().split("T")[0];

      const workoutResult = await db.runAsync(
        `INSERT INTO workouts (user_id, workout_date, title, description) VALUES (?, ?, ?, ?)`,
        [data.userId, formattedworkout_date, data.title.trim(), data.description.trim()],
      );

      newWorkoutId = workoutResult.lastInsertRowId;

      for (const exercise of data.exercises) {
        const workoutExerciseResult = await db.runAsync(
          `INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)`,
          [newWorkoutId, exercise.exerciseId],
        );

        const workoutExerciseId = workoutExerciseResult.lastInsertRowId;

        let setNumber = 1;
        for (const set of exercise.sets) {
          await db.runAsync(
            `INSERT INTO workout_sets
                  (workout_exercise_id, set_number, reps, weight, rir, completed) 
                  VALUES(?, ?, ?, ?, ?, ?)`,
            [
              workoutExerciseId,
              setNumber,
              set.reps,
              set.weight,
              set.rir,
              set.completed ? 1 : 0,
            ],
          );
          setNumber++;
        }
      }
    });

    return newWorkoutId;
  },

  async saveWithRawLog(data: SaveRawWorkoutParams): Promise<number> {
    const formattedworkout_date = data.workout_date.toISOString().split("T")[0];
    const formattedLastEditedAt = new Date().toISOString();

    const workoutResult = await db.runAsync(
      `INSERT INTO workouts (user_id, workout_date, title) VALUES (?, ?, ?)`,
      [data.userId, formattedworkout_date, data.title.trim()],
    );

    const newWorkoutId = workoutResult.lastInsertRowId;

    await db.runAsync(
      `INSERT INTO raw_workout_logs (workout_id, content, last_edited_at) VALUES (?, ?, ?)`,
      [newWorkoutId, data.content.trim(), formattedLastEditedAt],
    );

    return newWorkoutId;
  }
};