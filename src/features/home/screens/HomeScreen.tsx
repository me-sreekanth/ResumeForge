import React from "react";
import { View, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Go to Resume Builder" onPress={() => navigation.navigate("ResumeForm")} />
    </View>
  );
}