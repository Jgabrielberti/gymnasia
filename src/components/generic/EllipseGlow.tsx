import { ColorValue, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


type GradientColors = [
  ColorValue,
  ColorValue,
  ...ColorValue[]
];

type EllipseGlowProps = {
  width?: number;
  height?: number;
  opacity?: number;

  outerColors?: GradientColors;
  innerColors?: GradientColors;
  style?: ViewStyle;
};

export function EllipseGlow({
  width = 480,
  height = 280,
  opacity = 0.4,

  outerColors = ['#33CC99', '#052F28', 'transparent'],
  innerColors = ['#33CC99', '#1AA06D', '#052F28'],
}: EllipseGlowProps) {
  return (
    <>
      <LinearGradient
        colors={outerColors}
        style={{
          position: 'absolute',

          width: width * 1.15,
          height: height * 1.15,

          opacity: opacity * 0.4,

          borderRadius: 9999,

          transform: [{ scaleX: 1.3 }],
        }}
      />

      <LinearGradient
        colors={innerColors}
        style={{
          position: 'absolute',

          width,
          height,

          opacity,

          borderRadius: 9999,

          transform: [{ scaleX: 1.2 }],
        }}
      />
    </>
  );
}