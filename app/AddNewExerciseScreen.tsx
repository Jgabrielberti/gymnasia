import { ExerciseRepository } from "@/repositories/ExerciseRepository";
import { muscles } from "@/db/trainingData/muscles";
import {
  View,
  Pressable,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/theme";
import { SinglePicker } from "@/components/generic/SinglePicker";
import MultiPicker from "@/components/generic/MultiPicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Avatar } from "@/components/training/Avatar";

export default function AddNewExerciseScreen() {
  const router = useRouter();

  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState("Hipertrofia");
  const [primaryMuscles, setPrimaryMuscles] = useState<number[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<number[]>([]);
  const [description, setDescription] = useState(""); // Novo estado
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const trimmedName = exerciseName.trim().replace(/\s+/g, " ");

    if (!trimmedName) {
      Alert.alert("Erro", "Por favor, digite o nome do exercício.");
      return;
    }
    if (primaryMuscles.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um músculo primário.");
      return;
    }

    try {
      setIsSaving(true);
      const exists = await ExerciseRepository.exists(trimmedName);
      if (exists) {
        Alert.alert(
          "Exercício já existe",
          `O exercício "${trimmedName}" já existe na sua biblioteca. Tente outro nome.`
        );
        return;
      }

      await ExerciseRepository.create({
        name: trimmedName,
        category,
        primaryMuscles,
        secondaryMuscles,
        description: description.trim(), 
      });

      Alert.alert("Sucesso", "Exercício adicionado com sucesso!", [
        { text: "OK", onPress: () => router.back() }
      ]);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o exercício.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          hitSlop={15}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.training.primary} />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crie um novo exercício</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME DO EXERCÍCIO</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Supino Reto com Halteres"
                placeholderTextColor={Colors.textColors.textMuted}
                value={exerciseName}
                onChangeText={setExerciseName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CATEGORIA</Text>
            <View style={styles.pickerWrapper}>
              <SinglePicker
                placeholder="Categoria"
                selectedValue={category}
                onValueChange={(value) => setCategory(value as string)}
              >
                <SinglePicker.Item label="Hipertrofia" value="Hipertrofia" />
                <SinglePicker.Item label="Força" value="Força" />
                <SinglePicker.Item label="Resistência" value="Resistência" />
                <SinglePicker.Item label="Cardio" value="Cardio" />
              </SinglePicker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MÚSCULOS PRIMÁRIOS</Text>
            <View style={styles.pickerWrapper}>
              <MultiPicker
                placeholder="Primários"
                selectedValues={primaryMuscles}
                onValueChange={(values) => setPrimaryMuscles(values)}
              >
                {muscles.map((muscle) => (
                  <MultiPicker.Item key={`primary-${muscle.id}`} label={muscle.name} value={muscle.id} />
                ))}
              </MultiPicker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>MÚSCULOS SECUNDÁRIOS (OPCIONAL)</Text>
            <View style={styles.pickerWrapper}>
              <MultiPicker
                placeholder="Sinergistas"
                selectedValues={secondaryMuscles}
                onValueChange={(values) => setSecondaryMuscles(values)}
              >
                {muscles.map((muscle) => (
                  <MultiPicker.Item key={`secondary-${muscle.id}`} label={muscle.name} value={muscle.id} />
                ))}
              </MultiPicker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DESCRIÇÃO / NOTAS (OPCIONAL)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Dicas de execução, cadência, etc."
              placeholderTextColor={Colors.textColors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Avatar />

        </View>

        <Pressable
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.training.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Exercício</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 60,
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: Colors.textColors.text,
    fontSize: 28,
    fontWeight: "bold",
    
    lineHeight: 40,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  form: {
    gap: 32,
    marginBottom: 40,
  },
  inputGroup: {
    flexDirection: "column",
    gap: 8,
  },
  label: {
    color: Colors.training.primary,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    paddingLeft: 4,
    paddingBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingBottom: 4,
  },
  pickerWrapper: {
    paddingBottom: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.textColors.text,
    fontSize: 18,
  },
  textArea: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    
    paddingBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.training.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.training.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 60,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.textColors.blackText,
    fontSize: 18,
    fontWeight: "bold",
  },
});