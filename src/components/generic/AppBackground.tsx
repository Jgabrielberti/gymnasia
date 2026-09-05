import { View, StyleSheet } from 'react-native';
import { Colors } from "@/src/constants/theme";

type Props = {
  children: React.ReactNode;
};

export function AppBackground({ children }: Props) {
  return (
      <View style={styles.appBackground}>
        {children}
      </View>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    width: "100%",
    height: "100%",
    padding: 0, 
    margin: 0, 
    backgroundColor: Colors.background,
  },
});