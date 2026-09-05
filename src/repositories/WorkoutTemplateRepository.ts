import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "@/src/db";
import {
  workoutTemplates,
  workoutTemplateExercises,
  workoutTemplateSets,
} from "@/src/db/schema";
import { UserRepository } from "./UserRepository";

export interface WorkoutTemplatePreview {
  id: number;
  folder_id: number;
  name: string;
  total_sets: number;
  description: string | null;
  exercisesPreview: {
    id: number;
    name: string;
    setsCount: number;
  }[];
  totalExercises: number;
}

export type TemplateSetPayload = {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  rir: number | null;
};

export type TemplateExercisePayload = {
  exerciseId: number;
  order: number;
  sets: TemplateSetPayload[];
};

export type SaveTemplatePayload = {
  id: number;
  folder_id: number;
  title: string;
  description: string | null;
  exercises: TemplateExercisePayload[];
};

export const WorkoutTemplateRepository = {
  async getAllPreviews(): Promise<WorkoutTemplatePreview[]> {
    try {
      const userId = await UserRepository.getCurrentId();

      const templates = await db.query.workoutTemplates.findMany({
        where: eq(workoutTemplates.userId, userId!),
        orderBy: desc(workoutTemplates.createdAt),
        with: {
          templateExercises: {
            orderBy: asc(workoutTemplateExercises.exerciseOrder),
            with: {
              exercise: true,
              sets: true,
            },
          },
        },
      });

      return templates.map((template) => ({
        id: template.id,
        folder_id: template.folderId,
        name: template.name,
        total_sets: template.totalSets,
        description: template.description,
        totalExercises: template.templateExercises.length,
        exercisesPreview: template.templateExercises.slice(0, 2).map((te) => ({
          id: te.exercise.id,
          name: te.exercise.name,
          setsCount: te.sets.length,
        })),
      }));
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      throw error;
    }
  },

  async saveTemplate(payload: SaveTemplatePayload): Promise<number> {
    try {
      const userId = await UserRepository.getCurrentId();
      if (!userId) throw new Error("Usuário não encontrado.");

      let templateId = payload.id;

      const totalSets = payload.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

      await db.transaction(async (tx) => {
        if (templateId) {
          await tx
            .update(workoutTemplates)
            .set({
              name: payload.title,
              description: payload.description,
              totalSets,
              folderId: payload.folder_id,
            })
            .where(and(eq(workoutTemplates.id, templateId), eq(workoutTemplates.userId, userId)));

          await tx
            .delete(workoutTemplateExercises)
            .where(eq(workoutTemplateExercises.workoutTemplateId, templateId));
        } else {
          const inserted = await tx
            .insert(workoutTemplates)
            .values({
              userId,
              folderId: payload.folder_id,
              name: payload.title,
              description: payload.description,
              totalSets,
              createdAt: new Date().toISOString(),
            })
            .returning({ id: workoutTemplates.id });

          templateId = inserted[0].id;
        }

        for (const ex of payload.exercises) {
          const insertedExercise = await tx
            .insert(workoutTemplateExercises)
            .values({
              workoutTemplateId: templateId!,
              exerciseId: ex.exerciseId,
              exerciseOrder: ex.order,
            })
            .returning({ id: workoutTemplateExercises.id });

          const wteId = insertedExercise[0].id;

          if (ex.sets.length > 0) {
            await tx.insert(workoutTemplateSets).values(
              ex.sets.map((set) => ({
                workoutTemplateExerciseId: wteId,
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight,
                rir: set.rir,
              })),
            );
          }
        }
      });

      return templateId!;
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      throw error;
    }
  },

  async deleteTemplate(templateId: number): Promise<number | null> {
    try {
      const userId = await UserRepository.getCurrentId();
      if (!userId) throw new Error("Usuário não encontrado.");

      if (!templateId) {
        throw new Error("Template não existe");
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(workoutTemplates)
          .where(and(eq(workoutTemplates.id, templateId), eq(workoutTemplates.userId, userId)));
      });

      return templateId;
    } catch (error) {
      console.error("Erro ao deletar template:", error);
      throw error;
    }
  },

  async getTemplateById(id: number) {
    try {
      const template = await db.query.workoutTemplates.findFirst({
        where: eq(workoutTemplates.id, id),
        with: {
          templateExercises: {
            orderBy: asc(workoutTemplateExercises.exerciseOrder),
            with: {
              exercise: true,
              sets: {
                orderBy: asc(workoutTemplateSets.setNumber),
              },
            },
          },
        },
      });

      if (!template) return null;

      return {
        id: template.id,
        folder_id: template.folderId,
        title: template.name,
        description: template.description,
        exercises: template.templateExercises.map((te) => ({
          uiId: te.id.toString(),
          exerciseId: te.exercise.id,
          name: te.exercise.name,
          sets: te.sets.map((set) => ({
            id: set.id.toString(),
            weight: set.weight !== null ? set.weight.toString() : "",
            reps: set.reps !== null ? set.reps.toString() : "",
            rir: set.rir !== null ? set.rir.toString() : "",
          })),
        })),
      };
    } catch (error) {
      console.error("Erro ao buscar template por ID:", error);
      throw error;
    }
  },
};
