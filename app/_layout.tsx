import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import { initializeDatabase } from "@/db";

import { UserRepository } from "@/repositories/UserRepository";
import { AuthProvider } from "@/services/AuthProvider";
import { AuthContext } from "@/services/AuthContext";
import { Colors } from "@/constants/theme";

function LayoutNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useContext(AuthContext);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    setNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!navigationReady) return;

    UserRepository.exists()
      .then((exists) => {
        if (!exists) {
          router.replace("/(auth)/RegisterScreen");
        } else if (exists && !isAuthenticated) {
          router.replace("/(auth)/LoginScreen");
        } else if (exists && isAuthenticated) {
          router.replace("/(tabs)");
        }
      })
      .catch((err) => {
        console.error("Erro ao checar existência do usuário:", err);
      });
  }, [isAuthenticated, navigationReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="TrainingNotesScreen"
        options={{
          headerShown: false,
          title: "Notas do Treino",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="TrainingStructuredNotesScreen"
        options={{
          headerShown: false,
          title: "Notas do Treino",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      initializeDatabase();
      setDbReady(true);
    } catch (error) {
      console.error(
        "Erro crítico ao inicializar tabelas do SQLite nativo:",
        error,
      );
      setDbReady(true);
    }
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.training.primaryDark1} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <LayoutNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.background,
    color: Colors.textColors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
