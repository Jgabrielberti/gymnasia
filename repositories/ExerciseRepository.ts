import { db } from "@/db";

export type NewExerciseParams = {
  name: string;
  category: string | null;
  primaryMuscles: number[];
  secondaryMuscles: number[];
  description: string | null;
};

export const ExerciseRepository = {
  
  async exists(name: string): Promise<boolean> {
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM exercises WHERE LOWER(name) = LOWER(?);`,
        [name.trim()]
      );
      return (result?.count ?? 0) > 0;
    } catch (error) {
      console.error("Erro ao verificar existência do exercício:", error);
      return false;
    }
  },

  async create(data: NewExerciseParams): Promise<number> {
    let newExerciseId: number = 0;

    await db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        `INSERT INTO exercises (name, category, description, created_at) VALUES (?, ?, ?, ?)`,
        [data.name, data.category, data.description, new Date().toISOString()],
      );

      newExerciseId = result.lastInsertRowId;

      for (const muscleId of data.primaryMuscles) {
        await db.runAsync(
          `INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, role) VALUES (?, ?, ?)`,
          [newExerciseId, Number(muscleId), "primary"],
        );
      }

      for (const muscleId of data.secondaryMuscles) {
        await db.runAsync(
          `INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, role) VALUES (?, ?, ?)`,
          [newExerciseId, Number(muscleId), "secondary"],
        );
      }
    });

    return newExerciseId;
  },

  async getAll(searchQuery: string = ""): Promise<{ id: number; name: string }[]> {
    try {
      const query = `
        SELECT id, name 
        FROM exercises 
        WHERE name LIKE ? 
        ORDER BY name ASC;
      `;
      const results = await db.getAllAsync<{ id: number; name: string }>(query, [`%${searchQuery}%`]);
      return results;
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      return [];
    }
  },
};