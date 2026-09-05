import { db } from "@/src/db";
import { users, bodyWeightLogs } from "@/src/db/schema";

export interface RegisterUserData {
  username: string;
  weight: number;
  height: number;
  birth_date: string;
  gender: "male" | "female";
}

export const UserRepository = {
  async exists(): Promise<boolean> {
    const rows = await db.select({ id: users.id }).from(users).limit(1);
    return rows.length > 0;
  },

  async getCurrentId(): Promise<number | null> {
    const rows = await db.select({ id: users.id }).from(users).limit(1);
    return rows[0]?.id ?? null;
  },

  async create(data: RegisterUserData) {
    let newUserId: number | null = null;
    const createdAt = new Date().toISOString();

    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(users)
        .values({
          name: data.username,
          height: data.height,
          birthDate: data.birth_date,
          gender: data.gender,
          createdAt,
        })
        .returning({ id: users.id });

      newUserId = inserted[0]?.id ?? null;

      if (!newUserId) {
        throw new Error("Falha ao criar o usuário.");
      }

      await tx.insert(bodyWeightLogs).values({
        userId: newUserId,
        weight: data.weight,
        measuredAt: createdAt,
      });
    });

    return { id: newUserId, ...data, createdAt };
  },
};
