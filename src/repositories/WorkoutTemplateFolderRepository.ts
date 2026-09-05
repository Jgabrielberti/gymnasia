import { eq, and, asc } from "drizzle-orm";
import { db } from "@/src/db";
import { workoutTemplateFolders } from "@/src/db/schema";
import { UserRepository } from "./UserRepository";

export interface WorkoutTemplateFolder {
  id: number;
  name: string;
  description: string | null;
}

export const WorkoutTemplateFolderRepository = {
  async getAll(): Promise<WorkoutTemplateFolder[]> {
    const userId = await UserRepository.getCurrentId();

    return await db
      .select({
        id: workoutTemplateFolders.id,
        name: workoutTemplateFolders.name,
        description: workoutTemplateFolders.description,
      })
      .from(workoutTemplateFolders)
      .where(eq(workoutTemplateFolders.userId, userId!))
      .orderBy(asc(workoutTemplateFolders.createdAt));
  },

  async get(id: number): Promise<[number, string | undefined, string | null | undefined]> {
    try {
      const rows = await db
        .select({
          name: workoutTemplateFolders.name,
          description: workoutTemplateFolders.description,
        })
        .from(workoutTemplateFolders)
        .where(eq(workoutTemplateFolders.id, id));

      return [id, rows[0]?.name, rows[0]?.description];
    } catch (error) {
      console.log("Erro ao buscar");
      throw error;
    }
  },

  async create(name: string, description: string | null): Promise<number> {
    const userId = await UserRepository.getCurrentId();

    const inserted = await db
      .insert(workoutTemplateFolders)
      .values({
        userId: userId!,
        name,
        description,
        createdAt: new Date().toISOString(),
      })
      .returning({ id: workoutTemplateFolders.id });

    return inserted[0].id;
  },

  async update(id: number, name: string, description: string | null): Promise<void> {
    const userId = await UserRepository.getCurrentId();

    await db
      .update(workoutTemplateFolders)
      .set({ name, description })
      .where(and(eq(workoutTemplateFolders.id, id), eq(workoutTemplateFolders.userId, userId!)));
  },

  async delete(id: number): Promise<void> {
    try {
      const userId = await UserRepository.getCurrentId();

      await db.transaction(async (tx) => {
        await tx
          .delete(workoutTemplateFolders)
          .where(and(eq(workoutTemplateFolders.id, id), eq(workoutTemplateFolders.userId, userId!)));
      });
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
      throw error;
    }
  },
};
