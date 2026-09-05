import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/src/constants/theme";

export type DailyCaloriesMacrosCardProps = {
  caloriesConsumed?: number;
  calorieGoal?: number;
  carbohydratesConsumed?: number;
  carbohydratesGoal?: number;
  fatsConsumed?: number;
  fatsGoal?: number;
  proteinConsumed?: number;
  proteinGoal?: number;
};

export default function DailyCaloriesMacrosCard({
  caloriesConsumed = 0,
  calorieGoal = 2000,
  carbohydratesConsumed = 0,
  carbohydratesGoal = 0,
  fatsConsumed = 0,
  fatsGoal = 0,
  proteinConsumed = 0,
  proteinGoal = 0,
}: DailyCaloriesMacrosCardProps) {
  // TODO: Replace these values with data from the nutrition repository.
  // The component intentionally remains repository-agnostic for now.
  const caloriesRemaining = Math.max(calorieGoal - caloriesConsumed, 0);
  const calorieProgress =
    calorieGoal > 0 ? Math.min(caloriesConsumed / calorieGoal, 1) : 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Calorias</Text>

        <View style={styles.valueRow}>
          <View style={styles.valueGroup}>
            <Text style={styles.primaryValue}>{caloriesConsumed} cal</Text>
            <Text style={styles.secondaryValue}> / {calorieGoal}</Text>
          </View>

          <View style={styles.valueGroup}>
            <Text style={styles.primaryValue}>{caloriesRemaining}</Text>
            <Text style={styles.secondaryValue}> Restantes</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${calorieProgress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.macrosHeader}>
          <Text style={styles.macroTitle}>Carboidratos</Text>
          <Text style={styles.macroTitle}>Gorduras</Text>
          <Text style={styles.macroTitle}>Proteínas</Text>
        </View>

        <View style={styles.macrosValuesRow}>
          <MacroValue consumed={carbohydratesConsumed} goal={carbohydratesGoal} unit="g" />
          <MacroValue consumed={fatsConsumed} goal={fatsGoal} unit="g" />
          <MacroValue consumed={proteinConsumed} goal={proteinGoal} unit="g" />
        </View>

        <View style={styles.macrosProgressRow}>
          <MacroProgress consumed={carbohydratesConsumed} goal={carbohydratesGoal} />
          <MacroProgress consumed={fatsConsumed} goal={fatsGoal} />
          <MacroProgress consumed={proteinConsumed} goal={proteinGoal} />
        </View>
      </View>
    </View>
  );
}

function MacroValue({ consumed, goal, unit }: { consumed: number; goal: number; unit: string }) {
  return (
    <View style={styles.macroValueGroup}>
      <View style={styles.valueGroup}>
        <Text style={styles.primaryMacroValue}>{consumed}</Text>
        <Text style={styles.secondaryMacroValue}> / {goal || "--"}{goal > 0 ? unit : ""}</Text>
      </View>
    </View>
  );
}

function MacroProgress({ consumed, goal }: { consumed: number; goal: number }) {
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;

  return (
    <View style={styles.macroProgressTrack}>
      <View style={[styles.macroProgressFill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "transparent",
    gap: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#202020",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  title: {
    color: Colors.textColors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 11,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueGroup: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  primaryValue: {
    color: Colors.textColors.text,
    fontSize: 27,
    fontWeight: "700",
  },
  secondaryValue: {
    color: Colors.textColors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#383838",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.nutrition.primary,
    borderRadius: 999,
  },
  macrosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  macroTitle: {
    color: Colors.textColors.text,
    fontSize: 14,
    fontWeight: "600",
    width: "31%",
  },
  macrosValuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroValueGroup: {
    width: "31%",
  },
  primaryMacroValue: {
    color: Colors.textColors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  secondaryMacroValue: {
    color: Colors.textColors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  macrosProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  macroProgressTrack: {
    width: "31%",
    height: 6,
    backgroundColor: "#383838",
    borderRadius: 999,
    overflow: "hidden",
  },
  macroProgressFill: {
    height: "100%",
    backgroundColor: Colors.nutrition.primaryDark,
    borderRadius: 999,
  },
});
