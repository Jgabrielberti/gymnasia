import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/src/constants/theme";

export function StartEmptyTrainingLog() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            router.push({ pathname: "/TrainingStructuredNotesScreen" });
          }}
        >
          <Text style={styles.buttonText}>Iniciar Treino Vazio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
  },
  header: {
    width: "100%",
    justifyContent: "flex-start",
    paddingBottom: 10,
    paddingLeft: 12,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 420,
  },
  button: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 20,

    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderBottomWidth: 5,
    borderColor: Colors.training.primary,
    
    paddingVertical: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 24,
    color: Colors.textColors.text,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
