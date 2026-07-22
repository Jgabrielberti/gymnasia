import { Pressable, View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/theme";
import { TrainRestGraph } from "@/components/calendar/TrainRestGraph";


type TrainingLogsMonthlyStats = {
  date: Date | null;
};

export function TrainingLogsMonthlyStats({ date }: TrainingLogsMonthlyStats) {
    const today = new Date();
    const monthName = today.toLocaleString("pt-BR", {
        month: "long",
    });

    return (
    <View style={styles.screenWrapper}>
      <BlurView intensity={40} tint="dark" style={styles.glassContainer}>
        <View style={styles.components}>
            <Text style={styles.title}>
                Status de {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </Text>

            <View style={styles.statsContainer}>
                <TrainRestGraph />

                
            </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  glassContainer: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    width: "100%",
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.textColors.text,
    textAlign: "center",
    paddingVertical: 12,
  },
  statsContainer: {

  }
});
