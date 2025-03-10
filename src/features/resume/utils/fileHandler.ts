import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export const pickJsonFile = async (): Promise<any | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });

    if (result.canceled) return null; // User canceled the selection

    // Read the JSON file content
    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};
