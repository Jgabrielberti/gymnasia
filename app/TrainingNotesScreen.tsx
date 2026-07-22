import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/theme";
import { WorkoutRepository } from "@/repositories/WorkoutRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppBackground } from "@/components/generic/AppBackground";

export default function TrainingNotesScreen() {
  const date = new Date();

  const router = useRouter();

  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutText, setWorkoutText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSaveWorkout() {
    if (!workoutTitle.trim() || !workoutText.trim()) {
      alert(
        "Campos vazios. Por favor, preencha o título e a descrição do treino.",
      );
      return;
    }

    const id = await UserRepository.getCurrentId();
    if (!id) {
      alert("Erro. Id do usuário não encontrado");
      return;
    }

    try {
      setLoading(true);

      await WorkoutRepository.saveWithRawLog({
        userId: id,
        workout_date: date,
        title: workoutTitle,
        content: workoutText,
      });

      alert("Treino salvo com sucesso");
      router.back();
    } catch (error) {
      alert("Erro. Não foi possível salvar o treino.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppBackground>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.wrapper}>
          <View style={styles.headerContainer}>
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="chevron-back"
                size={30}
                color={Colors.training.primary}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                router.push("/TimerScreen");
              }}
            >
              <Ionicons
                name="timer-outline"
                size={35}
                color={Colors.training.primary}
              />
            </Pressable>

            <Pressable
              style={[loading && { opacity: 0.5 }]}
              onPress={() => handleSaveWorkout()}
              disabled={loading}
            >
              <Ionicons
                name="bookmark-sharp"
                size={30}
                color={Colors.training.primary}
              />
            </Pressable>
          </View>

          <TextInput
            style={styles.inputTitle}
            placeholder="Título do Treino"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
          />
          <TextInput
            multiline
            textAlignVertical="top"
            placeholder={`Descreva seu treino, ex:\n\nSupino\n1x12 40kg (Aquecimento)\n1x8 80kg\n1x8 (Falha)`}
            placeholderTextColor={Colors.textColors.textSecondary}
            value={workoutText}
            onChangeText={setWorkoutText}
            style={styles.workoutInput}
          />
        </View>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 65,
    paddingHorizontal: 20,
  },
  inputTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textColors.text,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
  },
  workoutInput: {
    flex: 1,
    textAlign: "left",
    paddingHorizontal: 24,
    color: Colors.textColors.text,
    fontSize: 18,
  },
});
