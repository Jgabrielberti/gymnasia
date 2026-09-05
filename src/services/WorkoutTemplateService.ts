import { WorkoutTemplateRepository } from "@/src/repositories/WorkoutTemplateRepository";
import { Alert } from "react-native";

export type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  rir: string;
};

export type WorkoutExercise = {
  uiId: string;
  exerciseId: number;
  name: string;
  sets: WorkoutSet[];
};

export const WorkoutTemplateService = {
  async loadTemplate(templateId: number): Promise<{
    folder_id: number;
    title: string;
    description: string;
    exercises: WorkoutExercise[];
  } | null> {
    try {
      const data = await WorkoutTemplateRepository.getTemplateById(templateId);

      if (!data) return null;

      return {
        folder_id: data.folder_id,
        title: data.title,
        description: data.description || "",
        exercises: data.exercises,
      };
    } catch (error) {
      console.error(`Erro ao carregar template ID: ${templateId}`, error);
      Alert.alert("Erro", "Não foi possível carregar o template.");
      return null;
    }
  },
};