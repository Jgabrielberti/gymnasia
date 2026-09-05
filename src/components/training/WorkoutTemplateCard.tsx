import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/constants/theme";
import { WorkoutTemplatePreview } from "@/src/repositories/WorkoutTemplateRepository";
import { PopupMenu } from "@/src/components/generic/PopupMenu";

type Props = {
  template: WorkoutTemplatePreview;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function WorkoutTemplateCard({
  template,
  isMenuOpen,
  onToggleMenu,
  onStart,
  onEdit,
  onDelete,
}: Props) {
  const menuTriggerRef = useRef<View>(null);

  return (
    <View style={[styles.card, { zIndex: isMenuOpen ? 10 : 1 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {template.name}
          </Text>
          <Text style={styles.cardSubtitle}>{template.total_sets} séries</Text>
        </View>

        <View style={styles.cardActions}>
          <Pressable style={styles.iniciarButton} onPress={onStart}>
            <Text style={styles.iniciarButtonText}>Iniciar</Text>
          </Pressable>

          <Pressable
            ref={menuTriggerRef}
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            style={styles.optionsButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={Colors.textColors.textSecondary}
            />
          </Pressable>
        </View>

        <PopupMenu
          visible={isMenuOpen}
          onClose={onToggleMenu}
          anchorRef={menuTriggerRef}
          items={[
            { label: "Editar", icon: "pencil-outline", onPress: onEdit },
            {
              label: "Deletar",
              icon: "trash-outline",
              danger: true,
              onPress: onDelete,
            },
          ]}
        />
      </View>

      {template.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{template.description}</Text>
        </View>
      )}

      <View style={styles.exerciseList}>
        {template.exercisesPreview.map((ex) => (
          <View key={ex.id} style={styles.exerciseRow}>
            <View style={styles.exerciseIconContainer}>
              <Ionicons
                name="barbell-outline"
                size={20}
                color={Colors.training.primaryLight}
              />
            </View>
            <View>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseSets}>{ex.setsCount} séries</Text>
            </View>
          </View>
        ))}

        {template.totalExercises > 2 && (
          <Text style={styles.moreText}>
            e {template.totalExercises - 2} outros
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 16,
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
    width: "100%",
    marginRight: 12,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "relative",
  },
  iniciarButton: {
    backgroundColor: Colors.training.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iniciarButtonText: {
    color: Colors.training.primaryDark2,
    fontWeight: "bold",
    fontSize: 14,
  },
  optionsButton: {
    padding: 4,
  },
  optionText: {
    fontSize: 16,
    color: Colors.textColors.text,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textColors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textColors.textSecondary,
  },
  descriptionContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    width: "100%",
    color: Colors.textColors.textMuted,
    fontStyle: "italic",
  },
  exerciseList: {
    gap: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: Colors.textColors.text,
    fontWeight: "500",
  },
  exerciseSets: {
    fontSize: 13,
    color: Colors.textColors.textMuted,
    marginTop: 2,
  },
  moreText: {
    fontSize: 14,
    color: Colors.textColors.textSecondary,
    marginTop: 8,
    fontWeight: "500",
  },
});
