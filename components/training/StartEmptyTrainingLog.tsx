import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Colors,
  whiteText,
} from "@/constants/theme";
import { GradientText } from "@/components/generic/GradientText";

export function StartEmptyTrainingLog() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GradientText
          text="Novo Treino Vazio"
          colors={whiteText}
          style={styles.title}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            router.push({ pathname: "/TrainingNotesScreen" });
          }}
        >
          <Image
            source={require("@/assets/noteIconGreenMiddle.png")}
            style={{ width: 60, height: 60 }}
          />
          <Text style={styles.buttonText}>Registro em Texto Livre</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => {
            router.push({ pathname: "/TrainingStructuredNotesScreen" });
          }}
        >
          <Image 
      source={require('@/assets/structuredNoteIconGreenMiddleReversed.png')} 
      style={{ width: 60, height: 60 }} 
    />
          <Text style={styles.buttonText}>Registro Estruturado</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 40,
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: 20,

    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderBottomWidth: 5,
    borderColor: Colors.training.primary,

    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.textColors.text,
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
