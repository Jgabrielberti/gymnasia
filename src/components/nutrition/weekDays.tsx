import { useMemo } from "react";
import { Colors } from "@/src/constants/theme"; 
import { StyleSheet, Text, View } from "react-native";

const WEEK_DAYS = [
  { key: "sun", label: "D" },
  { key: "mon", label: "S" },
  { key: "tue", label: "T" },
  { key: "wed", label: "Q" },
  { key: "thu", label: "Q" },
  { key: "fri", label: "S" },
  { key: "sat", label: "S" },
];

export default function WeekDays() {
  const currentDay = useMemo(() => new Date().getDay(), []);

  return (
    <View style={styles.wrapper}>
      {WEEK_DAYS.map((day, index) => {
        const isToday = index === currentDay;

        return (
          <View key={day.key} style={styles.dayItem}>
            <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
              {day.label}
            </Text>
            <View style={[styles.dayCircle, isToday && styles.dayCircleToday]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  dayItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    gap: 7,
  },
  dayLabel: {
    color: Colors.textColors.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
  dayLabelToday: {
    color: Colors.textColors.text,
    fontWeight: "700",
  },
  dayCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.textColors.textMuted,
  },
  dayCircleToday: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderStyle: "dotted",
  },
});
