import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "@/src/db";
import migrations from "@/src/db//migrations/migrations";
import { initialSeeding } from "@/src/db/seeding/seeding";

import { UserRepository } from "@/src/repositories/UserRepository";
import { AuthProvider } from "@/src/services/AuthProvider";
import { AuthContext } from "@/src/services/AuthContext";
import { Colors } from "@/src/constants/theme";

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
  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) return;

    initialSeeding()
      .then(() => setSeeded(true))
      .catch((err) => setSeedError(err instanceof Error ? err : new Error(String(err))));
  }, [success]);

  if (error || seedError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.textColors.text }}>
          Erro ao preparar o banco de dados: {(error ?? seedError)?.message}
        </Text>
      </View>
    );
  }

  if (!success || !seeded) {
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