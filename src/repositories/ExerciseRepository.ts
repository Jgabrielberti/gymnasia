import { eq, sql, like, asc, count } from "drizzle-orm";
import { db } from "@/src/db";
import { exercises, exerciseMuscleGroups } from "@/src/db/schema";

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
      const rows = await db
        .select({ count: count() })
        .from(exercises)
        .where(eq(sql`lower(${exercises.name})`, name.trim().toLowerCase()));

      return (rows[0]?.count ?? 0) > 0;
    } catch (error) {
      console.error("Erro ao verificar existência do exercício:", error);
      return false;
    }
  },

  async create(data: NewExerciseParams): Promise<number> {
    let newExerciseId = 0;

    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(exercises)
        .values({
          name: data.name,
          category: data.category,
          description: data.description,
          createdAt: new Date().toISOString(),
        })
        .returning({ id: exercises.id });

      newExerciseId = inserted[0].id;

      if (data.primaryMuscles.length > 0) {
        await tx.insert(exerciseMuscleGroups).values(
          data.primaryMuscles.map((muscleId) => ({
            exerciseId: newExerciseId,
            muscleGroupId: Number(muscleId),
            role: "primary" as const,
          })),
        );
      }

      if (data.secondaryMuscles.length > 0) {
        await tx.insert(exerciseMuscleGroups).values(
          data.secondaryMuscles.map((muscleId) => ({
            exerciseId: newExerciseId,
            muscleGroupId: Number(muscleId),
            role: "secondary" as const,
          })),
        );
      }
    });

    return newExerciseId;
  },

  async getAll(searchQuery: string = ""): Promise<{ id: number; name: string }[]> {
    try {
      return await db
        .select({ id: exercises.id, name: exercises.name })
        .from(exercises)
        .where(like(exercises.name, `%${searchQuery}%`))
        .orderBy(asc(exercises.name));
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      return [];
    }
  },
};
