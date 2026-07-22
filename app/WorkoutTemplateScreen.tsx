import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ExerciseSearchModal } from "@/components/training/ExerciseSearchModal";
import { WorkoutTemplateRepository } from "@/repositories/WorkoutTemplateRepository";
import { WorkoutTemplateService } from "@/services/WorkoutTemplateService";

type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  rir: string;
};

type WorkoutExercise = {
  uiId: string; 
  exerciseId: number;
  name: string;
  sets: WorkoutSet[];
};

export default function WorkoutTemplateScreen() {
  const router = useRouter();

  const { templateId, folder_id: folderIdParam } = useLocalSearchParams<{
    templateId?: string;
    folder_id?: string;
  }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(
    folderIdParam ? Number(folderIdParam) : null,
  );

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (templateId) {
      loadExistingTemplate(Number(templateId));
    }
  }, [templateId]);

  async function loadExistingTemplate(id: number) {
    const data = await WorkoutTemplateService.loadTemplate(id);
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setExercises(data.exercises);
      setCurrentFolderId(data.folder_id);
    }
  }

  const handleSelectExerciseFromModal = (exercise: { id: number; name: string }) => {
    const newExercise: WorkoutExercise = {
      uiId: Date.now().toString(), 
      exerciseId: exercise.id,
      name: exercise.name,
      sets: [{ id: Date.now().toString() + "-set", weight: "", reps: "", rir: "" }],
    };
    setExercises([...exercises, newExercise]);
    setModalVisible(false);
  };

  const handleRemoveExercise = (uiId: string) => {
    setExercises(exercises.filter((ex) => ex.uiId !== uiId));
  };

  const handleAddSet = (uiId: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.uiId === uiId) {
          return {
            ...ex,
            sets: [...ex.sets, { id: Date.now().toString(), weight: "", reps: "", rir: "" }],
          };
        }
        return ex;
      })
    );
  };

  const handleUpdateSet = (uiId: string, setId: string, field: keyof WorkoutSet, value: string) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.uiId === uiId) {
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id === setId) {
                return { ...set, [field]: value };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const handleSaveTemplate = async () => {
    if (!title.trim()) {
      Alert.alert("Aviso", "Por favor, insira um título para o treino.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Aviso", "O treino precisa ter pelo menos um exercício.");
      return;
    }

    const payload = {
      id: Number(templateId),
      folder_id: currentFolderId,
      title: title.trim(),
      description: description.trim(),
      exercises: exercises.map((ex, index) => ({
        exerciseId: ex.exerciseId,
        order: index,
        sets: ex.sets.map((set, setIndex) => ({
          setNumber: setIndex + 1,
          weight: set.weight ? parseFloat(set.weight) : null,
          reps: set.reps ? parseInt(set.reps, 10) : null,
          rir: set.rir ? parseInt(set.rir, 10) : null,
        })),
      })),
    };

    try {
      await WorkoutTemplateRepository.saveTemplate(payload);
      Alert.alert("Template salvo");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o template.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.goBack} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={35} color={Colors.training.primary} />
        </Pressable>
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.title}
            placeholder="Título do Treino"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.description}
            placeholder="Descrição (opcional)"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </View>

      <ScrollView
        style={styles.exercisesContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => (
          <View key={exercise.uiId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Pressable onPress={() => handleRemoveExercise(exercise.uiId)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color={Colors.systemStateColors.danger} />
              </Pressable>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colSet]}>Série</Text>
              <Text style={[styles.tableHeaderText, styles.colInput]}>Peso</Text>
              <Text style={[styles.tableHeaderText, styles.colInput]}>Reps</Text>
              <Text style={[styles.tableHeaderText, styles.colInput]}>RIR</Text>
            </View>

            {exercise.sets.map((set, index) => (
              <View key={set.id} style={styles.tableRow}>
                <View style={styles.colSet}>
                  <Text style={styles.setNumber}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.inputCell, styles.colInput]}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={Colors.textColors.textMuted}
                  value={set.weight}
                  onChangeText={(val) => handleUpdateSet(exercise.uiId, set.id, "weight", val)}
                />
                <TextInput
                  style={[styles.inputCell, styles.colInput]}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={Colors.textColors.textMuted}
                  value={set.reps}
                  onChangeText={(val) => handleUpdateSet(exercise.uiId, set.id, "reps", val)}
                />
                <TextInput
                  style={[styles.inputCell, styles.colInput]}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={Colors.textColors.textMuted}
                  value={set.rir}
                  onChangeText={(val) => handleUpdateSet(exercise.uiId, set.id, "rir", val)}
                />
              </View>
            ))}

            <Pressable style={styles.addSetButton} onPress={() => handleAddSet(exercise.uiId)}>
              <Ionicons name="add" size={18} color={Colors.textColors.text} />
              <Text style={styles.addSetText}>Adicionar Série</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.addExerciseButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.training.primary} />
          <Text style={styles.addExerciseText}>Adicionar Exercício</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSaveTemplate}>
          <Text style={styles.saveButtonText}>Salvar Template</Text>
        </Pressable>
      </View>

      <ExerciseSearchModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onSelectExercise={handleSelectExerciseFromModal} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  goBack: {
    paddingTop: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textColors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: Colors.textColors.textSecondary,
    minHeight: 40,
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.training.primary,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  
  tableHeader: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: Colors.textColors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colSet: {
    width: 40,
    alignItems: "center",
  },
  colInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  setNumber: {
    color: Colors.textColors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputCell: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    color: Colors.textColors.text,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 16,
  },
  
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
  },
  addSetText: {
    color: Colors.textColors.text,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.training.primary,
    borderStyle: "dashed",
    marginHorizontal: 40,
  },
  addExerciseText: {
    color: Colors.training.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.training.primaryDark2,
    backgroundColor: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.training.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 40,
  },
  saveButtonText: {
    color: Colors.textColors.blackText,
    fontSize: 18,
    fontWeight: "bold",
  },
});