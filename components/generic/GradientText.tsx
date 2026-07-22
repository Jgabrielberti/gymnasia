import React from 'react';
import { Text, StyleSheet, TextProps, ColorValue } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type GradientColors = [
  ColorValue,
  ColorValue,
  ...ColorValue[]
];

interface GradientTextProps extends TextProps {
  colors: GradientColors
  text: string;
}

export const GradientText = ({ colors, text, style, ...props }: GradientTextProps) => {
  return (
    <MaskedView
      maskElement={
        <Text {...props} style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }} // Starts top-left
        end={{ x: 1, y: 0 }}   // Ends top-right (horizontal gradient)
      >
        <Text {...props} style={[style, { opacity: 0 }]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};
