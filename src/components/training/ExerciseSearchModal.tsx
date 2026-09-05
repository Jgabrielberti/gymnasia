import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/theme";
import { ExerciseRepository } from "@/src/repositories/ExerciseRepository";
import { useRouter } from "expo-router";

type ExerciseSearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: { id: number; name: string }) => void;
};

export function ExerciseSearchModal({
  visible,
  onClose,
  onSelectExercise,
}: ExerciseSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadExercises(searchQuery);
    }
  }, [searchQuery, visible]);

  async function loadExercises(query: string) {
    setLoading(true);
    const data = await ExerciseRepository.getAll(query);
    setExercises(data);
    setLoading(false);
  }

  const handleSelect = (exercise: { id: number; name: string }) => {
    setSearchQuery("");
    onSelectExercise(exercise);
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Exercício</Text>
            <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => {router.push("/AddNewExerciseScreen")}}>
              <Ionicons name="add" size={26} color={Colors.training.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textColors.text} />
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.textColors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar exercício..."
              placeholderTextColor={Colors.textColors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={Colors.training.primary} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Ionicons name="add-circle-outline" size={24} color={Colors.training.primary} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.background,
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textColors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.textColors.text,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  exerciseName: {
    fontSize: 16,
    color: Colors.textColors.text,
  },
  emptyText: {
    color: Colors.textColors.textMuted,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});