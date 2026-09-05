import React from "react";
import { ColorValue, View, ViewStyle, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ExpoGradientColors = [string, string, ...string[]];
type GradientColors = [ColorValue, ColorValue, ...ColorValue[]];

type BubbleProps = {
  size?: number;
  colors?: GradientColors;
  style?: ViewStyle;
};

export function Bubble({
  size = 260,
  colors = ["rgba(51,204,153,0.35)", "rgba(5,47,40,0.15)"],
  style,
}: BubbleProps) {
  
  const stringColors = colors.map((color) => color.toString()) as ExpoGradientColors;
  
  return (
    <View
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >

      {/* Corpo principal */}
      <LinearGradient
        colors={stringColors}
        start={{ x: 0.15, y: 0.15 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        
        {/* Profundidade inferior */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.10)", "rgba(0,0,0,0.18)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            position: "absolute",

            width: "100%",
            height: "100%",

            borderRadius: size / 2,
          }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",

    opacity: 0.15,

    transform: [{ scale: 1.05 }],
  },

  bubble: {
    overflow: "hidden",

    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
