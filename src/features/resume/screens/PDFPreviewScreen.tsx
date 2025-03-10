import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, Platform, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { TextInput, Button, Card, Divider } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { generatePDF } from "../utils/pdfGenerator";
import { RootStackParamList } from "../../../navigation/RootStackParamList";

type PDFPreviewScreenProps = NativeStackScreenProps<RootStackParamList, "PDFPreview">;

export default function PDFPreviewScreen({ route, navigation }: PDFPreviewScreenProps) {
  const { resume } = route.params;
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>("Resume");

  useEffect(() => {
    const generate = async () => {
      console.log("📝 Generating PDF...");
      setLoading(true);
      const uri = await generatePDF(resume);
      if (uri) {
        console.log(`✅ PDF generated at: ${uri}`);
        try {
          const newUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
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
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          console.log("❌ User denied folder access.");
          Alert.alert("Permission Required", "Please allow access to save the file.");
          return;
        }

        const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          `${fileName}.pdf`,
          "application/pdf"
        );

        console.log(`📂 Saving PDF to: ${destinationUri}`);

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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="File Name"
            value={fileName}
            onChangeText={setFileName}
            style={styles.input}
          />
          <Divider style={styles.divider} />
          
          {loading ? (
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          ) : (
            <>
              <Button mode="contained" icon="file-eye" onPress={openPDF} style={styles.button}>
                Open PDF
              </Button>
              <Button mode="contained" icon="download" onPress={downloadPDF} style={styles.button}>
                Download PDF
              </Button>
              <Button mode="contained" icon="share" onPress={sharePDF} style={styles.button}>
                Share PDF
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 15,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  input: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 5,
  },
});
