import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  WorkoutTemplateRepository,
  WorkoutTemplatePreview,
} from "@/repositories/WorkoutTemplateRepository";
import {
  WorkoutTemplateFolderRepository,
  WorkoutTemplateFolder,
} from "@/repositories/WorkoutTemplateFolderRepository";
import { WorkoutFolderCard } from "@/components/training/WorkoutFolderCard";
import { WorkoutTemplateCard } from "@/components/training/WorkoutTemplateCard";
import { FolderFormModal } from "@/components/training/FolderFormModal";

export function ExistingWorkoutPlans() {
  const router = useRouter();

  const [folders, setFolders] = useState<WorkoutTemplateFolder[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplatePreview[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<number>>(
    new Set(),
  );
  const [activeTemplateMenuId, setActiveTemplateMenuId] = useState<number | null>(null);
  const [activeFolderMenuId, setActiveFolderMenuId] = useState<number | null>(null);

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<WorkoutTemplateFolder | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          const [folderData, templateData] = await Promise.all([
            WorkoutTemplateFolderRepository.getAll(),
            WorkoutTemplateRepository.getAllPreviews(),
          ]);
          setFolders(folderData);
          setTemplates(templateData);
        } catch (error) {
          console.error("Erro ao carregar planos:", error);
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }, []),
  );

  const closeMenus = () => {
    setActiveTemplateMenuId(null);
    setActiveFolderMenuId(null);
  };

  const toggleFolder = (folder_id: number) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      next.has(folder_id) ? next.delete(folder_id) : next.add(folder_id);
      return next;
    });
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setFolderModalVisible(true);
  };

  const handleEditFolder = (folder: WorkoutTemplateFolder) => {
    setActiveFolderMenuId(null);
    setEditingFolder(folder);
    setFolderModalVisible(true);
  };

  const handleDeleteFolder = (folder: WorkoutTemplateFolder) => {
    setActiveFolderMenuId(null);

    Alert.alert(
      "Excluir Pasta",
      `Tem certeza que deseja deletar "${folder.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await WorkoutTemplateFolderRepository.delete(folder.id);
              const [updatedFolders, updatedTemplates] = await Promise.all([
                WorkoutTemplateFolderRepository.getAll(),
                WorkoutTemplateRepository.getAllPreviews(),
              ]);
              setFolders(updatedFolders);
              setTemplates(updatedTemplates);
            } catch (error) {
              console.error("Erro ao deletar pasta:", error);
            }
          },
        },
      ],
    );
  };

  const handleSubmitFolder = async (
    name: string,
    description: string | null,
  ) => {
    if (editingFolder) {
      await WorkoutTemplateFolderRepository.update(
        editingFolder.id,
        name,
        description,
      );
    } else {
      await WorkoutTemplateFolderRepository.create(name, description);
    }
    setFolderModalVisible(false);
    const updated = await WorkoutTemplateFolderRepository.getAll();
    setFolders(updated);
  };

  const handleAddTemplateToFolder = (folder_id: number) => {
    setActiveFolderMenuId(null);
    router.push({
      pathname: "/WorkoutTemplateScreen",
      params: { folder_id },
    });
  };

  const handleEditTemplate = (template: WorkoutTemplatePreview) => {
    setActiveTemplateMenuId(null);
    router.push({
      pathname: "/WorkoutTemplateScreen",
      params: { templateId: template.id },
    });
  };

  const handleDeleteTemplate = (templateId: number) => {
    setActiveTemplateMenuId(null);
    Alert.alert(
      "Excluir Treino",
      "Tem certeza que deseja deletar este plano de treino? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await WorkoutTemplateRepository.deleteTemplate(templateId);
              setTemplates((prev) => prev.filter((t) => t.id !== templateId));
            } catch (error) {
              console.error("Erro ao deletar:", error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.training.primary}
        style={styles.loader}
      />
    );
  }

  return (
    <Pressable style={styles.container} onPress={closeMenus}>
      <View style={styles.header}>
        <Text style={styles.title}>Planos de Treino</Text>
        <Pressable hitSlop={15} onPress={handleCreateFolder}>
          <Ionicons
            name="add-sharp"
            color={Colors.training.primary}
            size={40}
          />
        </Pressable>
      </View>

      {folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma pasta criada ainda.</Text>
          <Pressable
            onPress={handleCreateFolder}
            style={styles.createFirstFolderButton}
          >
            <Text style={styles.createFirstFolderText}>Criar Primeira Pasta</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {folders.map((folder, index) => {
            const folderTemplates = templates.filter(
              (t) => t.folder_id === folder.id,
            );
            const isFolderMenuOpen = activeFolderMenuId === folder.id;

            return (
              <View
                key={folder.id}
                style={{
                  zIndex: isFolderMenuOpen ? 999 : folders.length - index,
                  elevation: isFolderMenuOpen ? 999 : folders.length - index,
                }}
              >
                <WorkoutFolderCard
                  name={folder.name}
                  description={folder.description}
                  isExpanded={expandedFolderIds.has(folder.id)}
                  isMenuOpen={isFolderMenuOpen}
                  onToggleExpand={() => toggleFolder(folder.id)}
                  onToggleMenu={() =>
                    setActiveFolderMenuId(
                      isFolderMenuOpen ? null : folder.id,
                    )
                  }
                  onAddTemplate={() => handleAddTemplateToFolder(folder.id)}
                  onEdit={() => handleEditFolder(folder)}
                  onDelete={() => handleDeleteFolder(folder)}
                >
                  {folderTemplates.length === 0 ? (
                    <Text style={styles.emptyFolderText}>
                      Nenhum treino nesta pasta.
                    </Text>
                  ) : (
                    folderTemplates.map((template, tIndex) => {
                      const isTemplateMenuOpen = activeTemplateMenuId === template.id;
                      
                      return (
                        <View key={template.id}>
                          <WorkoutTemplateCard
                            template={template}
                            isMenuOpen={isTemplateMenuOpen}
                            onToggleMenu={() =>
                              setActiveTemplateMenuId(
                                isTemplateMenuOpen ? null : template.id,
                              )
                            }
                            onStart={() =>
                              router.push({
                                pathname: "/TrainingStructuredNotesScreen",
                                params: { templateId: template.id },
                              })
                            }
                            onEdit={() => handleEditTemplate(template)}
                            onDelete={() => handleDeleteTemplate(template.id)}
                          />
                        </View>
                      );
                    })
                  )}
                </WorkoutFolderCard>
              </View>
            );
          })}
        </ScrollView>
      )}

      <FolderFormModal
        visible={folderModalVisible}
        initialName={editingFolder?.name}
        initialDescription={editingFolder?.description}
        onClose={() => setFolderModalVisible(false)}
        onSubmit={handleSubmitFolder}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingHorizontal: 5,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textColors.text,
  },
  loader: {
    marginTop: 40,
  },
  cardsContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    gap: 16,
  },
  emptyText: {
    color: Colors.textColors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  emptyFolderText: {
    color: Colors.textColors.textSecondary,
    fontSize: 14,
    alignSelf: "center",
  },
  createFirstFolderButton: {
    padding: 16,
    alignItems: "center",
    
    borderWidth: 1,
    borderBottomWidth: 5,
    borderRadius: 20,
    borderColor: Colors.training.primary,

    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  createFirstFolderText: {
    fontSize: 18,
    color: Colors.textColors.text,
  }
});
