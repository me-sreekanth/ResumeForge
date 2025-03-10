import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./RootStackParamList";
import HomeScreen from "../features/home/screens/HomeScreen";
import ResumeFormScreen from "../features/resume/screens/ResumeFormScreen"; // ✅ Import Resume Screen

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Recipes" }}
      />

      <Stack.Screen
        name="ResumeForm"
        component={ResumeFormScreen}
        options={{ title: "Resume Builder" }} // ✅ Add Resume Screen
      />
    </Stack.Navigator>
  );
}
