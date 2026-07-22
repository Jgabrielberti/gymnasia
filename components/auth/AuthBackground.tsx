import { View, StyleSheet } from "react-native";
import { Bubble } from "@/components/generic/Bubble";
import { greenPalette } from "@/constants/theme";

type Props = {
  children: React.ReactNode;
};

export function AuthBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <Bubble
        size={240}
        colors={greenPalette}
        style={styles.topBubble}
      />

      <Bubble
        size={200}
        colors={greenPalette}
        style={styles.middleBubble}
      />

      <Bubble
        size={250}
        colors={greenPalette}
        style={styles.bottomBubble}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  topBubble: {
    position: "absolute",

    top: -220,
    right: 180,

    opacity: 0.55,
  },

  middleBubble: {
    position: "absolute",

    right: -130,

    opacity: 0.55,
  },

  bottomBubble: {
    position: "absolute",

    bottom: -220,
    left: -70,

    opacity: 0.55,
  },
});
