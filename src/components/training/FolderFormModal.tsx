import { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/theme";

type Props = {
  visible: boolean;
  initialName?: string;
  initialDescription?: string | null;
  onClose: () => void;
  onSubmit: (name: string, description: string | null) => void;
};

export function FolderFormModal({
  visible,
  initialName = "",
  initialDescription = null,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setDescription(initialDescription ?? "");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), description.trim() || null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {initialName ? "Editar Pasta" : "Nova Pasta"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={Colors.textColors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={Colors.textColors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={handleSubmit}>
              <Text style={styles.confirmText}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    marginTop: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textColors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12,
    color: Colors.textColors.text,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: { padding: 10 },
  cancelText: { color: Colors.textColors.textSecondary },
  confirmButton: {
    backgroundColor: Colors.training.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  confirmText: { color: Colors.training.primaryDark2, fontWeight: "bold" },
});