import { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { WorkoutRepository } from "@/repositories/WorkoutRepository";
import { TrainingCalendar } from "@/components/calendar/TrainingCalendar";
import { TrainingLogsMonthlyStats } from "@/components/calendar/TrainingLogsMonthlyStats";

export default function StatusScreen() {
  const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [trainingDays, setTrainingDays] = useState<string[]>([]);
  
    useEffect(() => {
        async function loadData() {
          const days = await WorkoutRepository.getTrainingDays();
          setTrainingDays(days);
        }
        loadData();
      }, []);
    
      const handleDayPress = (date: Date) => {
        const dateString : string = date.toString();
        setSelectedDate(date);
        router.push({
          pathname:'/TrainingNotesScreen',
          params: { date: dateString },
        })
      };
  
    return (
      <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              style={styles.scrollView}
            >
              <TrainingCalendar
                trainingDays={trainingDays}
                onDayPress={handleDayPress}
              />
      
              <TrainingLogsMonthlyStats
                date={selectedDate}
              />
      
            </ScrollView>
          </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      alignItems: "center",
    },
    closeButton: {
      backgroundColor: "transparent",
    },
    closeButtonIcon: {
      color: Colors.training.primaryDark1,
    },
    dateText: {
      fontSize: 16,
      color: Colors.textColors.textSecondary,
    },
  });
  
  