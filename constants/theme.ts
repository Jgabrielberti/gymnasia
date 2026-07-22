import { Platform } from "react-native";
import { ColorValue } from "react-native";

export const Colors = {
  background: "#121212",

  textColors: {
    text: "#ECEDEE",
    blackText: "#121212",
    textSecondary: "rgba(255, 255, 255, 0.6)",
    textMuted: "rgba(255, 255, 255, 0.38)",
  },

  systemStateColors: {
    success: "#33CC99",
    danger: "#E74C3C",
    warning: "#F1C40F",
  },

  training: {
    primary: "#00ff9d",
    primaryLight: "#33CC99",
    primaryDark1: "#1AA06D",
    primaryDark2: "#052F28",
    middle: "#41dfd0",
    secondary: "#00e5ff",
    secondaryDark: "rgba(23, 81, 255, 1)",
    surfaceHighlight: "rgba(51, 204, 153, 0.1)",
  },

  nutrition: {
    primary: "#b96eff",
    primaryDark: "#7E22CE",    
    secondary: "#F15BB5",     
    surfaceHighlight: "rgba(168, 85, 247, 0.1)", 
  },

  social: {
    primary: "#6366F1",        
    aiAccent: "#38BDF8",      
    surfaceHighlight: "rgba(99, 102, 241, 0.1)",
  },

  profile: {
    primary: "#FF0080",
  }
};

type GradientColors = [ColorValue, ColorValue, ...ColorValue[]];

export const sunsetPalette: GradientColors = [
  "rgba(253, 224, 71, 0.9)",
  "rgba(249, 115, 22, 0.85)",
  "rgba(239, 68, 68, 0.80)",
  "rgba(139, 92, 246, 0.75)",
  "rgba(30, 58, 138, 0.70)",
];

export const greenPalette: GradientColors = [
  "rgba(51, 204, 153, 0.90)",
  "rgba(26, 160, 109, 0.85)",
  "rgba(18, 85, 68, 0.80)",
  "rgba(5, 47, 40, 0.75)",
  "rgba(10, 36, 36, 0.70)",
];

export const coldGalaxyPalette: GradientColors = [
  "rgba(6, 182, 212, 0.9)",
  "rgba(59, 130, 246, 0.85)",
  "rgba(99, 102, 241, 0.80)",
  "rgba(139, 92, 246, 0.75)",
  "rgba(76, 29, 149, 0.70)",
];

export const fadePalette: GradientColors = [
  "rgba(244, 63, 94, 0.9)",
  "rgba(236, 72, 153, 0.85)",
  "rgba(217, 70, 239, 0.80)",
  "rgba(147, 51, 234, 0.75)",
  "rgba(88, 28, 135, 0.70)",
];

export const pinkAquaGradient: GradientColors = [
  "rgba(65, 223, 208, 1)",
  "rgba(238, 131, 239, 1)",
];

export const blueMintGradient: GradientColors = [
  "#19D1E6",
  "#33CC99",
];

export const blueDarkGreenGradient: GradientColors = [
  "#19D1E6",
  "#052F28",
];

export const greenMintGradient: GradientColors = [
  "#33CC99",
  "#052F28",
];  

export const greenDarkGreenGradient: GradientColors = [
  "#1EDE80",
  "#052F28",
];

export const pureMint: GradientColors = [
  "#33cc99d2",
  "#33cc99",
];

export const whiteText: GradientColors = [
  "#ECEDEE",
  "#ECEDEE",
];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
