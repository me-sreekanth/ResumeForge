import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResumeFormScreen from "../features/resume/screens/ResumeFormScreen";
import PDFPreviewScreen from "../features/resume/screens/PDFPreviewScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ResumeForm" component={ResumeFormScreen} options={{ title: "Resume Builder" }} />
      <Stack.Screen name="PDFPreview" component={PDFPreviewScreen} options={{ title: "Preview Resume" }} />
    </Stack.Navigator>
  );
}
