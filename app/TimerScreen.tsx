import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { AppBackground } from "@/components/generic/AppBackground";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useRouter } from "expo-router";
import { TimerRepository } from "@/repositories/TimerRepository";

async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permissão negada",
      "Precisamos da permissão de notificação para te avisar quando o tempo acabar!",
    );
    return false;
  }
  return true;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type TimerData = {
  id: string;
  label: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  endTime: number | null;
  notificationId: string | null;
};

export default function TimerScreen() {
  const router = useRouter();
  const [timers, setTimers] = useState<TimerData[]>([]);

  useEffect(() => {
    async function loadTimers() {
      const data = await TimerRepository.getAllTimers();
      setTimers(data);
    }
    loadTimers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((currentTimers) =>
        currentTimers.map((timer) => {
          if (!timer.isRunning || !timer.endTime) return timer;

          const now = Date.now();
          const newTimeLeft = Math.max(0, Math.round((timer.endTime - now) / 1000));

          if (newTimeLeft === 0 && timer.timeLeft > 0) {
            const updatedTimer = {
              ...timer,
              timeLeft: 0,
              isRunning: false,
              endTime: null,
              notificationId: null,
            };
            
            TimerRepository.updateTimer(updatedTimer);
            return updatedTimer;
          }

          return { ...timer, timeLeft: newTimeLeft };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePlayPause = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) return;

    let updatedTimer: TimerData;

    if (!timer.isRunning) {
      if (timer.timeLeft === 0) return;
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      const notifId = await Notifications.scheduleNotificationAsync({
        content: { title: "Timer esgotado! ⏱️", body: `${timer.label} finalizado.`, sound: true, priority: Notifications.AndroidNotificationPriority.MAX },
        trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: timer.timeLeft, repeats: false },
      });

      updatedTimer = { ...timer, isRunning: true, endTime: Date.now() + timer.timeLeft * 1000, notificationId: notifId };
    } else {
      if (timer.notificationId) await Notifications.cancelScheduledNotificationAsync(timer.notificationId);
      updatedTimer = { ...timer, isRunning: false, endTime: null, notificationId: null };
    }

    setTimers((prev) => prev.map((t) => (t.id === id ? updatedTimer : t)));
    await TimerRepository.updateTimer(updatedTimer);
  };

  const handleReset = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) return;

    if (timer.notificationId) await Notifications.cancelScheduledNotificationAsync(timer.notificationId);

    const updatedTimer = { ...timer, timeLeft: timer.duration, isRunning: false, endTime: null, notificationId: null };
    
    setTimers((prev) => prev.map((t) => (t.id === id ? updatedTimer : t)));
    await TimerRepository.updateTimer(updatedTimer);
  };

  const handleAdd30Seconds = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) return;

    const newTimeLeft = timer.timeLeft + 30;
    let newNotifId = timer.notificationId;
    let newEndTime = timer.endTime;

    if (timer.isRunning) {
      if (timer.notificationId) await Notifications.cancelScheduledNotificationAsync(timer.notificationId);

      newNotifId = await Notifications.scheduleNotificationAsync({
        content: { title: "Timer esgotado! ⏱️", body: `${timer.label} finalizado.`, sound: true, priority: Notifications.AndroidNotificationPriority.MAX },
        trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: newTimeLeft, repeats: false },
      });
      newEndTime = Date.now() + newTimeLeft * 1000;
    }

    const updatedTimer = { ...timer, timeLeft: newTimeLeft, endTime: newEndTime, notificationId: newNotifId };

    setTimers((prev) => prev.map((t) => (t.id === id ? updatedTimer : t)));
    await TimerRepository.updateTimer(updatedTimer);
  };

  const addNewTimer = async () => {
    const newTimer: TimerData = {
      id: Math.random().toString(36).substring(7),
      label: `Timer Personalizado`,
      duration: 60,
      timeLeft: 60,
      isRunning: false,
      endTime: null,
      notificationId: null,
    };

    setTimers([...timers, newTimer]);
    await TimerRepository.createTimer(newTimer);
  };

  const removeTimer = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (timer?.notificationId) await Notifications.cancelScheduledNotificationAsync(timer.notificationId);

    setTimers(timers.filter((t) => t.id !== id));
    await TimerRepository.deleteTimer(id);
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => {router.back()}}>
            <Ionicons name="chevron-back" size={28} color={Colors.training.primary} />
          </Pressable>
          <Text style={styles.title}>Timers</Text>
          <Pressable onPress={addNewTimer} style={styles.addTimerButton}>
            <Ionicons name="add" size={28} color={Colors.textColors.text} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {timers.map((timer) => (
            <View key={timer.id} style={styles.card}>
              <Pressable style={styles.deleteButton} onPress={() => removeTimer(timer.id)}>
                <Ionicons name="close" size={20} color={Colors.textColors.textMuted} />
              </Pressable>

              <Text style={styles.cardLabel}>{timer.label}</Text>

              <View style={styles.cardBody}>
                <View style={styles.timeLeftContainer}>
                  <Text style={[styles.timeDisplay, timer.timeLeft === 0 && { color: Colors.systemStateColors.danger }]}>
                    {formatTime(timer.timeLeft)}
                  </Text>
                  <Pressable style={styles.resetButton} onPress={() => handleReset(timer.id)}>
                    <Ionicons name="refresh" size={20} color={Colors.textColors.textSecondary} />
                    <Text style={styles.resetText}>Resetar</Text>
                  </Pressable>
                </View>

                <View style={styles.controlsContainer}>
                  <Pressable style={styles.addTimeButton} onPress={() => handleAdd30Seconds(timer.id)}>
                    <Text style={styles.addTimeText}>+0:30</Text>
                  </Pressable>

                  <Pressable style={[styles.playButton, timer.isRunning && styles.pauseButton]} onPress={() => handlePlayPause(timer.id)}>
                    <Ionicons name={timer.isRunning ? "pause" : "play"} size={28} color={timer.isRunning ? Colors.training.primary : Colors.background} style={timer.isRunning ? {} : { marginLeft: 4 }} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textColors.text,
  },
  addTimerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: Colors.textColors.textSecondary,
    marginBottom: 16,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeLeftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: "300",
    color: Colors.textColors.text,
    fontVariant: ["tabular-nums"],
    marginBottom: 8,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  resetText: {
    color: Colors.textColors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  controlsContainer: {
    alignItems: "center",
    gap: 16,
  },
  addTimeButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addTimeText: {
    color: Colors.textColors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.training.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: Colors.training.primary,
  },
});
