import * as SQLite from "expo-sqlite";
import { defaultExercises } from "@/db/trainingData/defaultExercises";
import { muscles } from "@/db/trainingData/muscles";

export function initialSeeding(db: SQLite.SQLiteDatabase) {

  const exerciseCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM exercises",
  );

  if (exerciseCount && exerciseCount.count > 0) return;

  try {
    db.execSync("BEGIN TRANSACTION;");

    for (const m of muscles) {
      db.runSync(
        `INSERT INTO muscle_groups (id, name)
        VALUES (?, ?)`,
        [m.id, m.name],
      );
    }

    const now = new Date().toISOString();

    for (const ex of defaultExercises) {
      db.runSync(
        `INSERT INTO exercises (id, name, category, created_at)
     VALUES (?, ?, ?, ?)`,
        [ex.id, ex.name, ex.category, now],
      );

      for (const muscleId of ex.primaryMuscles) {
        db.runSync(
          `INSERT INTO exercise_muscle_groups
       (exercise_id, muscle_group_id, role)
       VALUES (?, ?, ?)`,
          [ex.id, muscleId, "primary"],
        );
      }

      for (const muscleId of ex.secondaryMuscles) {
        db.runSync(
          `INSERT INTO exercise_muscle_groups
       (exercise_id, muscle_group_id, role)
       VALUES (?, ?, ?)`,
          [ex.id, muscleId, "secondary"],
        );
      }
    }

    const folders = db.getAllSync
    db.execSync("COMMIT;");
    console.log("Banco de dados populado com sucesso");
  } catch (error) {
    db.execSync("ROLLBACK;");
    console.error("Erro ao popular dados iniciais:", error);
  }
}
