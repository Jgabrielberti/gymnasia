import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Colors } from "@/src/constants/theme";


export default function TabLayout() {
  const inactiveColor = Colors.textColors.textSecondary;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.textColors.text,
        tabBarInactiveTintColor: Colors.textColors.textSecondary,
        tabBarStyle: {
          paddingTop: 6,
          backgroundColor: Colors.background,
          borderTopWidth: 1, 
          borderTopColor: "rgba(255, 255, 255, 0.08)",
          elevation: 0,
        },
        tabBarBackground: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="library-outline" size={28} color={focused? Colors.training.secondary: inactiveColor} />
          ),
        }}
      />

      <Tabs.Screen
        name="TrainingLogsScreen"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={28}
              color={focused? Colors.training.primary: inactiveColor}
            />
          ),
        }}
      />


      <Tabs.Screen
        name="NutritionScreen"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="leaf" size={28} color={focused? Colors.nutrition.primary: inactiveColor} />
          ),
        }}
      />

      <Tabs.Screen
        name="SocialScreen"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="chatbubbles-outline" size={28} color={focused? Colors.social.primary: inactiveColor} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person" size={28} color={focused? Colors.profile.primary: inactiveColor} />
          ),
        }}
      />
    </Tabs>
  );
}
