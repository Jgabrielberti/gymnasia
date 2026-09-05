import React from "react";
import {
  ImageSourcePropType,
  ImageBackground,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ImageBubbleProps = {
  size?: number;
  image: ImageSourcePropType;
  style?: ViewStyle;
};

export function ImageBubble({
  size = 260,
  image,
  style,
}: ImageBubbleProps) {
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

      {/* Corpo da bolha */}
      <ImageBackground
        source={image}
        resizeMode="cover"
        imageStyle={{
          borderRadius: size / 2,
        }}
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        {/* Camada de vidro */}
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.18)",
            "rgba(255,255,255,0.05)",
            "rgba(255,255,255,0.02)",
          ]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Sombreamento inferior */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.22)",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: size / 2,
            },
          ]}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",

    backgroundColor: "rgba(168,85,247,0.20)",

    opacity: 0.8,

    transform: [{ scale: 1.05 }],
  },

  bubble: {
    overflow: "hidden",

    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },
});