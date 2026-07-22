import { db } from "@/db";

export interface RegisterUserData {
  username: string;
  weight: number;
  height: number;
  birth_date: string;
  gender: string;
}

export const UserRepository = {
  
  async exists(): Promise<boolean> {
    const result = db.getFirstSync<{ id: number }>("SELECT id FROM users LIMIT 1");
    return result !== null;
  },

  async getCurrentId(): Promise<number | null> {
    const result = db.getFirstSync<{ id: number }>("SELECT id FROM users LIMIT 1");
    return result?.id ?? null;
  },

  async create(data: RegisterUserData) {
    let newUserId: number | null = null;
    const createdAt = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      const userResult = await db.runAsync(
        `INSERT INTO users (name, height, birth_date, gender, created_at) VALUES (?, ?, ?, ?, ?)`,
        [data.username, data.height, data.birth_date, data.gender, createdAt],
      );

      newUserId = userResult.lastInsertRowId;

      if (!newUserId) {
        throw new Error("Falha ao criar o usuário.");
      }

      await db.runAsync(
        `INSERT INTO body_weight_logs (user_id, weight, measured_at) VALUES (?, ?, ?)`,
        [newUserId, data.weight, createdAt],
      );
    });

    return { id: newUserId, ...data, createdAt };
  }
};