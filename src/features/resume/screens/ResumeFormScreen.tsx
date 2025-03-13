import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { saveResume, loadResume } from "../services/storageService";
import { pickJsonFile } from "../utils/fileHandler";
import { Resume } from "../../../shared/types/Resume";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStackParamList";
import { TextInput, Button, Card, Divider, Text } from "react-native-paper";

export default function ResumeFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "ResumeForm">>();
  const [resume, setResume] = useState<Resume>({
    name: "",
    current_position: "",
    contact: { email: "", phone: "", linkedin: "", github: "" },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    achievements: [],
  });

  useEffect(() => {
    async function fetchResume() {
      const savedResume = await loadResume();
      if (savedResume) setResume(savedResume);
    }
    fetchResume();
  }, []);

  const handleSave = async () => {
    await saveResume(resume);
    Alert.alert("Success", "Resume saved!");
  };

  const handleUploadJson = async () => {
    const uploadedData = await pickJsonFile();
    if (uploadedData) {
      setResume({ ...uploadedData, skills: uploadedData.skills || [] });
      Alert.alert("Success", "Resume loaded from file!");
    } else {
      Alert.alert("Error", "Invalid JSON file or upload canceled.");
    }
  };

  const handlePreviewPDF = () => {
    navigation.navigate("PDFPreview", { resume });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.header}>Resume Details</Text>

              <Button mode="contained" icon="upload" onPress={handleUploadJson} style={styles.button}>
                Upload JSON Resume
              </Button>

              <Button mode="contained" icon="eye" onPress={handlePreviewPDF} style={styles.button}>
                Preview PDF
              </Button>

              <Divider style={styles.divider} />

              <TextInput label="Full Name" value={resume.name} onChangeText={(text) => setResume({ ...resume, name: text })} style={styles.input} mode="outlined" />
              <TextInput label="Current Position" value={resume.current_position} onChangeText={(text) => setResume({ ...resume, current_position: text })} style={styles.input} mode="outlined" />

              <Text style={styles.sectionTitle}>Contact Information</Text>
              <TextInput label="Email" value={resume.contact.email} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, email: text } })} style={styles.input} mode="outlined" />
              <TextInput label="Phone" value={resume.contact.phone} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, phone: text } })} style={styles.input} mode="outlined" />
              <TextInput label="LinkedIn" value={resume.contact.linkedin} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, linkedin: text } })} style={styles.input} mode="outlined" />
              <TextInput label="GitHub" value={resume.contact.github} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, github: text } })} style={styles.input} mode="outlined" />

              <Text style={styles.sectionTitle}>Summary</Text>
<TextInput
  label="Enter a brief summary..."
  value={resume.summary}
  onChangeText={(text) => setResume({ ...resume, summary: text })}
  mode="outlined"
  multiline
  placeholder="Write a short professional summary..."
  style={styles.autoExpandSummary}
/>
              <Text style={styles.sectionTitle}>Skills</Text>
              <TextInput label="Skills (comma-separated)" multiline value={resume.skills.join(", ")} onChangeText={(text) => setResume({ ...resume, skills: text.split(", ") })} style={styles.autoExpandInput} mode="outlined" />

              <Text style={styles.sectionTitle}>Experience</Text>
              {resume.experience.map((exp, index) => (
                <Card key={index} style={styles.subCard}>
                  <Card.Content>
                    <Text style={styles.cardHeader}>Company #{index + 1}</Text>
                    <TextInput label="Job Title" value={exp.title} onChangeText={(text) => {
                      const updatedExperience = [...resume.experience];
                      updatedExperience[index].title = text;
                      setResume({ ...resume, experience: updatedExperience });
                    }} mode="outlined" style={styles.cardInput} />
                    <TextInput label="Company" value={exp.company} onChangeText={(text) => {
                      const updatedExperience = [...resume.experience];
                      updatedExperience[index].company = text;
                      setResume({ ...resume, experience: updatedExperience });
                    }} mode="outlined" style={styles.cardInput} />
                    <TextInput label="Years" value={exp.years} onChangeText={(text) => {
                      const updatedExperience = [...resume.experience];
                      updatedExperience[index].years = text;
                      setResume({ ...resume, experience: updatedExperience });
                    }} mode="outlined" style={styles.cardInput} />
                    <Text style={styles.cardSubHeader}>Details:</Text>
                    {exp.details.map((detail, detailIndex) => (
                      <TextInput key={detailIndex} label="Enter a responsibility..." multiline value={detail} onChangeText={(text) => {
                        const updatedExperience = [...resume.experience];
                        updatedExperience[index].details[detailIndex] = text;
                        setResume({ ...resume, experience: updatedExperience });
                      }} mode="outlined" style={styles.autoExpandInput} />
                    ))}
                  </Card.Content>
                </Card>
              ))}

              <Text style={styles.sectionTitle}>Achievements</Text>
              {resume.achievements.map((achievement, index) => (
                <TextInput key={index} label="Enter an achievement..." multiline value={achievement} mode="outlined" style={styles.autoExpandInput} />
              ))}

<Text style={styles.sectionTitle}>Education</Text>
{resume.education.map((edu, index) => (
  <Card key={index} style={styles.subCard}>
    <Card.Content>
      <Text style={styles.subHeader}>Education #{index + 1}</Text>

      <TextInput
        label="Degree"
        value={edu.degree}
        onChangeText={(text) => {
          const updatedEducation = [...resume.education];
          updatedEducation[index].degree = text;
          setResume({ ...resume, education: updatedEducation });
        }}
        mode="outlined"
        style={styles.cardInput}
      />

      <TextInput
        label="Institution"
        value={edu.institution}
        onChangeText={(text) => {
          const updatedEducation = [...resume.education];
          updatedEducation[index].institution = text;
          setResume({ ...resume, education: updatedEducation });
        }}
        mode="outlined"
        style={styles.cardInput}
      />

      <TextInput
        label="Year"
        value={edu.year}
        onChangeText={(text) => {
          const updatedEducation = [...resume.education];
          updatedEducation[index].year = text;
          setResume({ ...resume, education: updatedEducation });
        }}
        mode="outlined"
        keyboardType="numeric"
        style={styles.cardInput}
      />

      <TextInput
        label="Grade"
        value={edu.grade}
        onChangeText={(text) => {
          const updatedEducation = [...resume.education];
          updatedEducation[index].grade = text;
          setResume({ ...resume, education: updatedEducation });
        }}
        mode="outlined"
        style={styles.cardInput}
      />

      <TextInput
        label="Remarks"
        value={edu.remarks}
        onChangeText={(text) => {
          const updatedEducation = [...resume.education];
          updatedEducation[index].remarks = text;
          setResume({ ...resume, education: updatedEducation });
        }}
        mode="outlined"
        // multiline
        placeholder="Any additional information..."
        style={styles.autoExpandText}
      />
    </Card.Content>
  </Card>
))}

              <Button mode="contained" icon="content-save" onPress={handleSave} style={styles.button}>
                Save Resume
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  card: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    marginBottom: 10,
  },
  subCard: {
    backgroundColor: "#FAFAFA",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardInput: {
    marginBottom: 5,
  },
  divider: {
    marginVertical: 15,
  },
  button: {
    marginVertical: 5,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardSubHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  autoExpandInput: {
    minHeight: 60,
    marginBottom: 10,
  },
  autoExpandSummary: {
    minHeight: 100, // Set a good minimum height
    textAlignVertical: "top", // Ensures text is not clipped
    marginBottom: 10, 
  },
  autoExpandText: {
    textAlignVertical: "top",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});