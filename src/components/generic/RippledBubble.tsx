import { ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ViewStyle } from 'react-native';


type GradientColors = [
  ColorValue,
  ColorValue,
  ...ColorValue[]
];

type BubbleProps = {
  size?: number;
  colors?: GradientColors;
  style?: ViewStyle;
};

export function RippledBubble({size = 100, colors = ['#33CC99', '#052F28'],}: BubbleProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderTopLeftRadius: size * 0.54,
        borderTopRightRadius: size * 0.46,
        borderBottomRightRadius: size * 0.50,
        borderBottomLeftRadius: size * 0.50,
      }}
    />
  );
}