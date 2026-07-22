import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { AuthContext } from "@/services/AuthContext";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

export function AuthRegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [birth_date, setbirth_date] = useState("");
  const [gender, setGender] = useState("");

  const { loading, registerUser } = useContext(AuthContext);

  const handlebirth_dateChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    
    setbirth_date(cleaned);
  };


  const handleRegisterSubmit = async () => {
    if (!username || !weight || !height || birth_date.length !== 10 || !gender) {
      Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      await registerUser({
        username,
        weight: parseFloat(weight),
        height: parseInt(height, 10),
        birth_date,
        gender,
      });

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Erro no cadastro",
        "Não foi possível realizar o cadastro. Tente novamente.",
      );
    }
  };

  return (
    <BlurView intensity={40} tint="dark" style={styles.glass_container}>
      <View style={styles.components}>
        <Text style={styles.title}>Seja bem vindo!</Text>

        <Text style={styles.subtitle}>
          Configure suas informações iniciais
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color={Colors.training.primaryDark1}
          />

          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="barbell-outline"
            size={20}
            color={Colors.training.primaryDark1}
          />

          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="resize-outline"
            size={20}
            color={Colors.training.primaryDark1}
          />

          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={Colors.training.primaryDark1}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento"
            placeholderTextColor={Colors.textColors.textSecondary}
            value={birth_date}
            onChangeText={handlebirth_dateChange}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.genderContainer}>
          <Pressable
            style={[
              styles.genderButton,
              gender === "male" && styles.genderButtonSelected, 
            ]}
            onPress={() => setGender("male")}
          >
            <Ionicons
              name="male-outline"
              size={50}
              color={gender === "male" ? Colors.training.primary : Colors.textColors.textMuted}
            />
          </Pressable>
          <Pressable
            style={[
              styles.genderButton,
              gender === "female" && styles.genderButtonSelected,
            ]}
            onPress={() => setGender("female")}
          >
            <Ionicons
              name="female-outline"
              size={50}
              color={gender === "female" ? Colors.training.primary : Colors.textColors.textMuted}
            />
          </Pressable>
        </View>

        <Text style={styles.info}>* Todas as informações podem ser alteradas e servem apenas para cálculos metabólicos dentro do aplicativo.</Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegisterSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.training.primary} />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
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
    borderRadius: 32,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.training.primary,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: Colors.textColors.text,
    fontSize: 16,
  },
  buttonContainer: {
    width: "60%",
    height: "auto",
  },
  button: {
    backgroundColor: Colors.training.primaryDark1,
    width: "100%",
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textColors.text,
    fontSize: 16,
    fontWeight: "bold",
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
  info: {
    color: Colors.textColors.textMuted,
    fontSize: 12,
    marginVertical: 5,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: 70,
    marginBottom: 14,
    gap: 25,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 5,
    borderColor: Colors.textColors.textMuted,
    borderRadius: 24,
  },
  genderButtonSelected: {
    borderColor: Colors.training.primary,
  }
});