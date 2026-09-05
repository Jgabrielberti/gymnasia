import { count } from "drizzle-orm";
import { db } from "@/src/db";
import { exercises, exerciseMuscleGroups, muscleGroups } from "@/src/db/schema";
import { defaultExercises } from "./defaultExercises";
import { muscles } from "./muscles";

const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export async function initialSeeding(): Promise<void> {
  const [existing] = await db.select({ count: count() }).from(exercises);

  if ((existing?.count ?? 0) > 0) return;

  try {
    await db.transaction(async (tx) => {
      for (const batch of chunk(muscles, BATCH_SIZE)) {
        await tx.insert(muscleGroups).values(
          batch.map((m) => ({ id: m.id, name: m.name })),
        );
      }

      const now = new Date().toISOString();

      for (const batch of chunk(defaultExercises, BATCH_SIZE)) {
        await tx.insert(exercises).values(
          batch.map((ex) => ({
            id: ex.id,
            name: ex.name,
            category: ex.category,
            createdAt: now,
          })),
        );
      }

      const muscleGroupRows = defaultExercises.flatMap((ex) => [
        ...ex.primaryMuscles.map((muscleId) => ({
          exerciseId: ex.id,
          muscleGroupId: muscleId,
          role: "primary" as const,
        })),
        ...ex.secondaryMuscles.map((muscleId) => ({
          exerciseId: ex.id,
          muscleGroupId: muscleId,
          role: "secondary" as const,
        })),
      ]);

      for (const batch of chunk(muscleGroupRows, BATCH_SIZE)) {
        await tx.insert(exerciseMuscleGroups).values(batch);
      }
    });

    console.log("Banco de dados populado com sucesso");
  } catch (error) {
    console.error("Erro ao popular dados iniciais:", error);
    throw error;
  }
}