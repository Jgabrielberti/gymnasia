import { ScrollView, StyleSheet, View } from "react-native";
import { AppBackground } from "@/src/components/generic/AppBackground";

import WeekDays from "@/src/components/nutrition/weekDays";
import DailyCaloriesMacrosCard from "@/src/components/nutrition/dailyCaloriesMacrosCard";
import MealsCards from "@/src/components/nutrition/mealsCards";

export default function NutritionScreen() {
  return (
    <AppBackground>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WeekDays />

        <View style={styles.sectionSpacing}>
          <DailyCaloriesMacrosCard />
        </View>

        <View style={styles.sectionSpacing}>
          <MealsCards />
        </View>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 60,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: "transparent",
  },
  sectionSpacing: {
    marginTop: 32,
    backgroundColor: "transparent",
  },
});
