import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

type TrainingCalendarProps = {
  trainingDays?: string[];
  onDayPress?: (date: Date) => void;
};

export function TrainingCalendar({
  trainingDays = [],
  onDayPress,
}: TrainingCalendarProps) {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const days = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthName = today.toLocaleString("pt-BR", {
    month: "long",
  });

  return (
    <View style={styles.screenWrapper}>
      <BlurView intensity={40} tint="dark" style={styles.glassContainer}>
        <View style={styles.components}>
          <View style={styles.calendarHeader}>
            <Ionicons
              name="calendar-sharp"
              size={35}
              style={styles.calendarIcon}
            />

            <Text style={styles.calendarTitle}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </Text>
          </View>

          {/* Cabeçalho da Semana com estrutura de tabela */}
          <View style={styles.weekHeader}>
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
              <View key={`${day}-${index}`} style={styles.weekDayContainer}>
                <Text style={styles.weekDay}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Grade dos dias (Tabela) */}
          <View style={styles.grid}>
            {days.map((day, index) => {
              if (!day) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = day === today.getDate();
              const hasTraining = trainingDays.includes(dateString);

              return (
                <Pressable
                  key={`day-${day}`}
                  style={[
                    styles.day,
                    isToday && styles.today,
                    hasTraining && styles.trainingDay,
                  ]}
                  onPress={() => onDayPress?.(new Date(year, month, day))}
                >
                  <View
                    style={[
                      styles.normalContainer,
                      (isToday || hasTraining) && styles.underlineContainer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        (isToday || hasTraining) && styles.highlightText,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.subtitlesContainer}>
            <Text style={styles.subtitles}>* Dias com um treino registrado são marcados com um traço</Text>
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
    marginTop: 60,
    marginBottom: 20,
    alignItems: "center",
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
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  calendarIcon: {
    position: "absolute",
    color: Colors.training.middle,
    left: 10,
  },
  calendarTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textColors.text,
    textAlign: "center",
    marginVertical: 12,
  },
  weekHeader: {
    flexDirection: "row",
    width: "100%",
  },
  weekDayContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  weekDay: {
    textAlign: "center",
    color: Colors.training.middle,
    fontWeight: "700",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 4,
    alignItems: "center",
    paddingBottom: 10,
  },
  emptyDay: {
    width: "14.285%",
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  day: {
    width: "14.285%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 0,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  dayText: {
    color: Colors.textColors.text,
    fontSize: 18,
  },
  today: {
    backgroundColor: Colors.training.secondary,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  trainingDay: {
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
  },
  highlightText: {
    fontWeight: "bold",
  },
  normalContainer: {},
  underlineContainer: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.training.middle,
    paddingBottom: 1,
  },
  subtitlesContainer:{
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  subtitles: {
    fontSize: 10,
    color: Colors.training.middle,
  },
});
