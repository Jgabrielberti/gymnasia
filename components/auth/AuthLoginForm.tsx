import { useContext, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "@/services/AuthContext";
import { Colors, greenPalette } from "@/constants/theme";

export function AuthLoginForm() {
  const router = useRouter();
  const { loading, performBiometricLogin } = useContext(AuthContext);

  return (
    <BlurView intensity={40} tint="dark" style={styles.glass_container}>
      <View style={styles.components}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Bem vindo de volta!</Text>

          <Text style={styles.subtitle}>
            Faça login usando FaceID, Biometria ou seu PIN / Senha
          </Text>
        </View>

        <View style={styles.containerLogin}>
          {!loading && (
            <Pressable
              onPress={performBiometricLogin}
              style={({ pressed }) => [
                styles.fingerprintContainer,
                pressed && styles.fingerprintPressed,
              ]}
            >
              <LinearGradient
                colors={greenPalette}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fingerprintRing}
              />

              <BlurView
                intensity={15}
                tint="dark"
                style={styles.fingerprintBackground}
              >
                <Ionicons
                  name="finger-print"
                  size={90}
                  color={Colors.training.primaryDark1}
                />
              </BlurView>
            </Pressable>
          )}

          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.training.primaryDark1}
              style={styles.loader}
            />
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={performBiometricLogin}
            >
              <Text style={styles.buttonText}>Fazer login</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.containerNoAccount}>
          <Pressable
            style={({ pressed }) => [
              styles.noAccountButton,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => {
              router.replace("/(auth)/RegisterScreen");
            }}
            disabled={loading}
          >
            <Text style={styles.noAccountText}>Não possui conta?</Text>
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass_container: {
    width: "90%",
    maxWidth: 420,
    minHeight: 400,
    borderRadius: 32,
    overflow: "hidden",

    justifyContent: "flex-start",
    alignItems: "center",

    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  components: {
    width: "100%",

    marginTop: 50,

    justifyContent: "center",
    alignItems: "center",
  },

  containerTitle: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 20,
  },

  containerLogin: {
    width: "80%",
    alignItems: "center",
    marginVertical: 30,
  },

  containerNoAccount: {
    marginTop: 40,
  },

  title: {
    color: Colors.textColors.text,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: Colors.textColors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  fingerprintContainer: {
    width: 160,
    height: 160,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,

    position: "relative",
  },

  fingerprintRing: {
    position: "absolute",

    width: 130,
    height: 130,

    borderRadius: 80,

    opacity: 0.9,
  },

  fingerprintBackground: {
    width: 120,
    height: 120,

    borderRadius: 60,

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  fingerprintPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
    color: Colors.training.primary,
  },

  button: {
    backgroundColor: "transparent",

    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.training.primary,
    fontSize: 16,
    fontWeight: "bold",
  },

  noAccountButton: {
    backgroundColor: "transparent",
    marginBottom: 35,
  },
  noAccountText: {
    color: Colors.training.primaryDark1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  loader: {
    marginVertical: 10,
  },
});
