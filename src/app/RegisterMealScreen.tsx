import { StyleSheet, View, Text, Pressable } from "react-native";
import { Colors } from "@/src/constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AppBackground } from "@/src/components/generic/AppBackground";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterMealScreen() {
  const router = useRouter();
  const { mealType: mealTypeParam } = useLocalSearchParams<{
    mealType?: string;
  }>();
  
  return (
    <AppBackground>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => {router.back()}}>
            <Ionicons name="chevron-back" size={30} color={Colors.nutrition.primary}/>
          </Pressable>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    marginTop: 60,
    marginHorizontal: 12,
  },
  header: {

  },
});