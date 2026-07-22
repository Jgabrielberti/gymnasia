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
import TimerScreen from "@/app/TimerScreen";

import { UserRepository } from "@/repositories/UserRepository";
import { WorkoutRepository } from "@/repositories/WorkoutRepository";
import { ExerciseSearchModal } from "@/components/training/ExerciseSearchModal";
import {
  WorkoutTemplateService,
  WorkoutExercise,
  WorkoutSet,
} from "@/services/WorkoutTemplateService";

export default function TrainingStructuredNotesScreen() {
  const router = useRouter();

  const { templateId } = useLocalSearchParams<{ templateId?: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (templateId) {
      fetchExistingTemplate(Number(templateId));
    }
  }, [templateId]);

  async function fetchExistingTemplate(id: number) {
    const templateData = await WorkoutTemplateService.loadTemplate(id);
    if (templateData) {
      setTitle(templateData.title);
      setDescription(templateData.description);
      setExercises(templateData.exercises);
    }
  }

  const handleSelectExerciseFromModal = (exercise: {
    id: number;
    name: string;
  }) => {
    const newExercise: WorkoutExercise = {
      uiId: Date.now().toString(),
      exerciseId: exercise.id,
      name: exercise.name,
      sets: [
        { id: Date.now().toString() + "-set", weight: "", reps: "", rir: "" },
      ],
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
            sets: [
              ...ex.sets,
              { id: Date.now().toString(), weight: "", reps: "", rir: "" },
            ],
          };
        }
        return ex;
      }),
    );
  };

  const handleUpdateSet = (
    uiId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: string,
  ) => {
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
      }),
    );
  };

  const loadExerciseInfoModal = (uiId: string) => {
    /*
      Show modal full screen (or maybe just normal component screen? since it need to be fullscreen, will modal have problems with fullscreen?), header has 
      exercise name on middle, a button with a "chevron-down" to close modal on left.
      Below header is a built in video of the exercise (just assume it exists with the exact name of the exercise,d
      something like exercise.name_video.mp4 or something like that in assets/videos).
      Bellow that is something that i think is complex, how hard would it be to create an avatar, front and back side by side, that has clear muscle separations,
      showing exactly what muscle is being targeted, primary and secondary, primary in Colors.training.primary, secondary in Colors.training.middle. rest all white 
      (maybe i should make this avatar a generic component that takes in muscle and sets, and changes color based on how many sets have been done on that muscle,
      like 0-5 Colors.nutrition.primary , 6-10 Colors.training.middle, 10-20 Colors.training.primary, 20+ (#FF0080)). Then for the info screen i just create a caption,
      that says: primary muscle group in color Colors.training.primary, so the text with a square on the left side with that color, 
      and the same for secondary muscle, but with Colors.training.middle. And i just pass 11 sets for the primary muscle, and 7 to the secondary, that works right?
      below that is a small description of what the exercise is and how to do then (again, assume it exists on assets/exerciseDescriptions/exercise.name_description.txt).
  */
  };

  async function handleSaveStructuredWorkout() {
    if (!title.trim()) {
      Alert.alert("Aviso", "Por favor, insira um título para o treino.");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Aviso", "O treino precisa ter pelo menos um exercício.");
      return;
    }

    const userId = await UserRepository.getCurrentId();
    if (!userId) {
      Alert.alert("Erro", "Id do usuário não encontrado.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: userId,
        workout_date: new Date(),
        title: title.trim(),
        description: description.trim(),
        exercises: exercises.map((ex, index) => ({
          exerciseId: ex.exerciseId,
          order: index,
          sets: ex.sets.map((set, setIndex) => ({
            setNumber: setIndex + 1,
            weight: set.weight ? parseFloat(set.weight) : 0,
            reps: set.reps ? parseInt(set.reps, 10) : 0,
            rir: set.rir ? parseInt(set.rir, 10) : null,
            completed: null,
          })),
        })),
      };

      console.log(
        "Treino finalizado pronto para salvar:\n",
        JSON.stringify(payload, null, 2),
      );

      await WorkoutRepository.saveStructured(payload);

      Alert.alert("Sucesso", "Treino salvo com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o treino.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.headerIcons} onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={30}
            color={Colors.training.primary}
          />
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
        <Pressable onPress={() => {router.push("/TimerScreen")}}>
          <Ionicons
            name="timer-outline"
            size={30}
            color={Colors.training.primary}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.exercisesContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => (
          <View key={exercise.uiId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Pressable
                onPress={() => loadExerciseInfoModal(exercise.uiId)}
                style={styles.cardHeaderButtons}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={26}
                  color={Colors.training.middle}
                />
              </Pressable>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Pressable
                onPress={() => handleRemoveExercise(exercise.uiId)}
                style={styles.cardHeaderButtons}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={Colors.systemStateColors.danger}
                />
              </Pressable>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colSet]}>Série</Text>
              <Text style={[styles.tableHeaderText, styles.colInput]}>
                Peso
              </Text>
              <Text style={[styles.tableHeaderText, styles.colInput]}>
                Reps
              </Text>
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
                  onChangeText={(val) =>
                    handleUpdateSet(exercise.uiId, set.id, "weight", val)
                  }
                />
                <TextInput
                  style={[styles.inputCell, styles.colInput]}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={Colors.textColors.textMuted}
                  value={set.reps}
                  onChangeText={(val) =>
                    handleUpdateSet(exercise.uiId, set.id, "reps", val)
                  }
                />
                <TextInput
                  style={[styles.inputCell, styles.colInput]}
                  keyboardType="numeric"
                  placeholder="-"
                  placeholderTextColor={Colors.textColors.textMuted}
                  value={set.rir}
                  onChangeText={(val) =>
                    handleUpdateSet(exercise.uiId, set.id, "rir", val)
                  }
                />
              </View>
            ))}

            <Pressable
              style={styles.addSetButton}
              onPress={() => handleAddSet(exercise.uiId)}
            >
              <Ionicons name="add" size={18} color={Colors.textColors.text} />
              <Text style={styles.addSetText}>Adicionar Série</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          style={styles.addExerciseButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.training.primary}
          />
          <Text style={styles.addExerciseText}>Adicionar Exercício</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSaveStructuredWorkout}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Finalizar Treino"}
          </Text>
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
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerIcons: {
    paddingTop: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textColors.text,
  },
  description: {
    fontSize: 16,
    color: Colors.textColors.textSecondary,
    minHeight: 40,
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 5,
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
    alignSelf: "center",
  },
  cardHeaderButtons: {
    padding: 4,
  },

  tableHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tableHeaderText: {
    color: Colors.textColors.textSecondary,
    fontSize: 14,
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
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.training.primaryDark2,
    backgroundColor: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.training.primaryLight,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 80,
  },
  saveButtonText: {
    color: Colors.textColors.blackText,
    fontSize: 18,
    fontWeight: "bold",
  },
});
