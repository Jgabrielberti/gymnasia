import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StartEmptyTrainingLog } from "@/components/training/StartEmptyTrainingLog";
import { ExistingWorkoutPlans } from "@/components/training/ExistingWorkoutPlans";

export default function TrainingLogsScreen() {

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.existingWorkoutPlansContainer}>
          <ExistingWorkoutPlans />
        </View>
        <View style={styles.emptyTrainingLogContainer}>
          <StartEmptyTrainingLog />
        </View>
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
    justifyContent:"center",
    alignItems: "center",
  },
  emptyTrainingLogContainer: {
    width: "100%",
  },
  existingWorkoutPlansContainer: {
    marginTop: 80,
    width: "100%",
  },
});
