import { db } from "@/db";
import { UserRepository } from "./UserRepository";

export interface WorkoutTemplateFolder {
  id: number;
  name: string;
  description: string | null;
}

export const WorkoutTemplateFolderRepository = {
  async getAll(): Promise<WorkoutTemplateFolder[]> {
    const userId = await UserRepository.getCurrentId();

    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      description: string | null;
      
    }>(
      `SELECT id, name, description
       FROM workout_template_folders
       WHERE user_id = ?
       ORDER BY created_at ASC;`,
      [userId],
    );

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    }));
  },

  async get(id: number): Promise<[number, string | undefined, string | null | undefined]> {
    try{
      const rows = await db.getFirstAsync<{
        
        name: string;
        description: string | null;
      }>(
        `SELECT name, description
         FROM workout_template_folders
         WHERE folder_id = ?`,
         [id],
      );

      return [id, rows?.name, rows?.description]
    } catch(error) {
      console.log("Erro ao buscar")
      throw error;
    }
  },

  async create(name: string, description: string | null): Promise<number> {
    const userId = await UserRepository.getCurrentId();

    const result = await db.runAsync(
      `INSERT INTO workout_template_folders (user_id, name, description, created_at)
       VALUES (?, ?, ?, ?);`,
      [userId, name, description, new Date().toISOString()],
    );
    return result.lastInsertRowId;
  },

  async update(
    id: number,
    name: string,
    description: string | null,
  ): Promise<void> {
    const userId = await UserRepository.getCurrentId();

    await db.runAsync(
      `UPDATE workout_template_folders SET name = ?, description = ? WHERE id = ? AND user_id = ?;`,
      [name, description, id, userId],
    );
  },

  async delete(id: number): Promise<void> {
  try {
    const userId = await UserRepository.getCurrentId();

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `DELETE FROM workout_template_folders WHERE id = ? AND user_id = ?;`,
        [id, userId],
      );
    });
  } catch (error) {
    console.error("Erro ao deletar pasta:", error);
    throw error;
  }
},
};