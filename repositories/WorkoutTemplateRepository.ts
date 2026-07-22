import { db } from "@/db";
import { UserRepository } from "./UserRepository";
import { WorkoutTemplateFolderRepository } from "./WorkoutTemplateFolderRepository";

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

      const templates = await db.getAllAsync<{
        id: number;
        folder_id: number;
        name: string;
        total_sets: number;
        description: string | null;
      }>(
        `SELECT id, folder_id, name, total_sets, description
         FROM workout_templates 
         WHERE user_id = ?
         ORDER BY created_at DESC;`,
        [userId],
      );

      const plansPreview: WorkoutTemplatePreview[] = [];

      for (const template of templates) {
        const exercises = await db.getAllAsync<{
          id: number;
          name: string;
          setsCount: number;
        }>(
          `SELECT 
            e.id, 
            e.name,
            (SELECT COUNT(*) FROM workout_template_sets wts WHERE wts.workout_template_exercise_id = wte.id) as setsCount
           FROM workout_template_exercises wte
           JOIN exercises e ON wte.exercise_id = e.id
           WHERE wte.workout_template_id = ?
           ORDER BY wte.exercise_order ASC
           LIMIT 2;`,
          [template.id],
        );

        const countResult = await db.getFirstAsync<{ total: number }>(
          `SELECT COUNT(*) as total 
           FROM workout_template_exercises 
           WHERE workout_template_id = ?;`,
          [template.id],
        );

        plansPreview.push({
          id: template.id,
          folder_id: template.folder_id,
          name: template.name,
          total_sets: template.total_sets,
          description: template.description,
          totalExercises: countResult?.total || 0,
          exercisesPreview: exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            setsCount: ex.setsCount,
          })),
        });
      }

      return plansPreview;
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      throw error;
    }
  },

  async saveTemplate(payload: SaveTemplatePayload): Promise<number> {
    try {
      const userId = await UserRepository.getCurrentId();
      if (!userId) throw new Error("Usuário não encontrado.");

      const folder_id = payload.folder_id;

      let templateId = payload.id;

      const totalSets = payload.exercises.reduce(
        (acc, ex) => acc + ex.sets.length,
        0,
      );

      await db.withTransactionAsync(async () => {
        if (templateId) {
          await db.runAsync(
            `UPDATE workout_templates 
             SET name = ?, description = ?, total_sets = ?, folder_id = ? 
             WHERE id = ? AND user_id = ?`,
            [
              payload.title,
              payload.description,
              totalSets,
              folder_id,
              templateId,
              userId,
            ],
          );

          await db.runAsync(
            `DELETE FROM workout_template_exercises WHERE workout_template_id = ?`,
            [templateId],
          );
        } else {
          const createdAt = new Date().toISOString();
          const result = await db.runAsync(
            `INSERT INTO workout_templates (user_id, folder_id, name, description, total_sets, created_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              folder_id,
              payload.title,
              payload.description,
              totalSets,
              createdAt,
            ],
          );
          templateId = result.lastInsertRowId;
        }

        for (const ex of payload.exercises) {
          const exResult = await db.runAsync(
            `INSERT INTO workout_template_exercises (workout_template_id, exercise_id, exercise_order) 
             VALUES (?, ?, ?)`,
            [templateId!, ex.exerciseId, ex.order],
          );
          const wteId = exResult.lastInsertRowId;

          for (const set of ex.sets) {
            await db.runAsync(
              `INSERT INTO workout_template_sets (workout_template_exercise_id, set_number, reps, weight, rir) 
               VALUES (?, ?, ?, ?, ?)`,
              [wteId, set.setNumber, set.reps, set.weight, set.rir],
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

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `DELETE FROM workout_templates WHERE id = ? AND user_id = ?`,
          [templateId, userId],
        );
      });

      return templateId;
    } catch (error) {
      console.error("Erro ao deletar template:", error);
      throw error;
    }
  },

  async getTemplateById(id: number) {
    try {
      const template = await db.getFirstAsync<{
        id: number;
        folder_id: number;
        name: string;
        description: string | null;
      }>(
        `SELECT id, folder_id, name, description 
       FROM workout_templates WHERE id = ?`,
        [id],
      );

      if (!template) return null;

      const exercisesRaw = await db.getAllAsync<{
        wte_id: number;
        exercise_id: number;
        exercise_order: number;
        name: string;
      }>(
        `SELECT wte.id as wte_id, wte.exercise_id, wte.exercise_order, e.name 
         FROM workout_template_exercises wte 
         JOIN exercises e ON wte.exercise_id = e.id 
         WHERE wte.workout_template_id = ? 
         ORDER BY wte.exercise_order ASC`,
        [id],
      );

      const formattedExercises = [];

      for (const ex of exercisesRaw) {
        const setsRaw = await db.getAllAsync<{
          id: number;
          set_number: number;
          reps: number | null;
          weight: number | null;
          rir: number | null;
        }>(
          `SELECT id, set_number, reps, weight, rir 
           FROM workout_template_sets 
           WHERE workout_template_exercise_id = ? 
           ORDER BY set_number ASC`,
          [ex.wte_id],
        );

        formattedExercises.push({
          uiId: ex.wte_id.toString(),
          exerciseId: ex.exercise_id,
          name: ex.name,
          sets: setsRaw.map((set) => ({
            id: set.id.toString(),
            weight: set.weight !== null ? set.weight.toString() : "",
            reps: set.reps !== null ? set.reps.toString() : "",
            rir: set.rir !== null ? set.rir.toString() : "",
          })),
        });
      }

      return {
        id: template.id,
        folder_id: template.folder_id,
        title: template.name,
        description: template.description,
        exercises: formattedExercises,
      };
    } catch (error) {
      console.error("Erro ao buscar template por ID:", error);
      throw error;
    }
  },
};
