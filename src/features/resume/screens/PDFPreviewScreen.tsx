import React, { useEffect, useState } from "react";
import { View, Button, Alert, ActivityIndicator, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { generatePDF } from "../utils/pdfGenerator";
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import * as DocumentPicker from "expo-document-picker";



type PDFPreviewScreenProps = NativeStackScreenProps<RootStackParamList, "PDFPreview">;

export default function PDFPreviewScreen({ route, navigation }: PDFPreviewScreenProps) {
  const { resume } = route.params;
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const generate = async () => {
      console.log("📝 Generating PDF...");
      setLoading(true);
      const uri = await generatePDF(resume);
      if (uri) {
        console.log(`✅ PDF generated at: ${uri}`);
        try {
          // Move file to a permanent location in app storage
          const newUri = `${FileSystem.documentDirectory}resume.pdf`;
          await FileSystem.moveAsync({ from: uri, to: newUri });

          console.log(`📂 Moved PDF to: ${newUri}`);
          setPdfUri(newUri);
        } catch (error) {
          console.error("❌ Error handling PDF file:", error);
          Alert.alert("Error", "Failed to save PDF.");
          navigation.goBack();
        }
      } else {
        Alert.alert("Error", "Failed to generate PDF.");
        navigation.goBack();
      }
      setLoading(false);
    };
    generate();
  }, [resume, navigation]);

  const openPDF = async () => {
    if (!pdfUri) {
      Alert.alert("Error", "PDF not available.");
      return;
    }

    console.log(`📖 Converting to Content URI: ${pdfUri}`);

    try {
      // Convert file:// URI to content:// URI
      const contentUri = await FileSystem.getContentUriAsync(pdfUri);
      console.log(`✅ Content URI: ${contentUri}`);

      if (Platform.OS === "android") {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
        console.log("✅ PDF opened successfully!");
      }
    } catch (error) {
      console.error("❌ Failed to open PDF:", error);
      Alert.alert("Error", "Could not open the PDF. Please install a PDF viewer.");
    }
  };


  
  const downloadPDF = async () => {
    if (!pdfUri) {
      Alert.alert("Error", "PDF not available.");
      return;
    }
  
    try {
      if (Platform.OS === "android") {
        // Prompt user to choose a folder
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  
        if (!permissions.granted) {
          console.log("❌ User denied folder access.");
          Alert.alert("Permission Required", "Please allow access to save the file.");
          return;
        }
  
        // Create a new file URI in the selected folder
        const fileName = "Resume.pdf";
        const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "application/pdf"
        );
  
        console.log(`📂 Saving PDF to: ${destinationUri}`);
  
        // Write the PDF data to the selected location
        const pdfData = await FileSystem.readAsStringAsync(pdfUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        await FileSystem.writeAsStringAsync(destinationUri, pdfData, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        console.log("✅ PDF successfully saved!");
        Alert.alert("Success", "PDF saved successfully to your selected folder.");
      } else {
        Alert.alert("Error", "Folder selection is only available on Android.");
      }
    } catch (error) {
      console.error("❌ Failed to save PDF:", error);
      Alert.alert("Error", "Could not save PDF.");
    }
  };
  
  

  const sharePDF = async () => {
    if (!pdfUri) {
      Alert.alert("Error", "PDF not available.");
      return;
    }

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, { mimeType: "application/pdf" });
        console.log("✅ PDF shared successfully!");
      } else {
        console.error("❌ Sharing not available.");
        Alert.alert("Error", "Cannot share PDF.");
      }
    } catch (error) {
      console.error("❌ Failed to share PDF:", error);
      Alert.alert("Error", "Could not share PDF.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {loading ? (
        <>
          <ActivityIndicator size="large" />
          <Button title="Generating PDF..." disabled />
        </>
      ) : (
        <>
          <Button title="Open PDF" onPress={openPDF} />
          <Button title="Download PDF" onPress={downloadPDF} />
          <Button title="Share PDF" onPress={sharePDF} />
        </>
      )}
    </View>
  );
}
