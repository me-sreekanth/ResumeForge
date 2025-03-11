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
              <TextInput label="Summary" multiline numberOfLines={4} value={resume.summary} onChangeText={(text) => setResume({ ...resume, summary: text })} style={styles.input} mode="outlined" />

              <Text style={styles.sectionTitle}>Skills</Text>
              <TextInput label="Skills (comma-separated)" value={resume.skills.join(", ")} onChangeText={(text) => setResume({ ...resume, skills: text.split(", ") })} style={styles.input} mode="outlined" />

              <Text style={styles.sectionTitle}>Experience</Text>
              {resume.experience.map((exp, index) => (
                <Card key={index} style={styles.subCard}>
                  <Card.Content>
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
                    <TextInput label="Details" multiline numberOfLines={3} value={exp.details.join("\n")} onChangeText={(text) => {
                      const updatedExperience = [...resume.experience];
                      updatedExperience[index].details = text.split("\n");
                      setResume({ ...resume, experience: updatedExperience });
                    }} mode="outlined" style={styles.cardInput} />
                  </Card.Content>
                </Card>
              ))}

              <Text style={styles.sectionTitle}>Projects</Text>
              {resume.projects.map((project, index) => (
                <Card key={index} style={styles.subCard}>
                  <Card.Content>
                    <TextInput label="Project Name" value={project.name} onChangeText={(text) => {
                      const updatedProjects = [...resume.projects];
                      updatedProjects[index].name = text;
                      setResume({ ...resume, projects: updatedProjects });
                    }} mode="outlined" style={styles.cardInput} />
                    <TextInput label="Project Description" multiline numberOfLines={3} value={project.description} onChangeText={(text) => {
                      const updatedProjects = [...resume.projects];
                      updatedProjects[index].description = text;
                      setResume({ ...resume, projects: updatedProjects });
                    }} mode="outlined" style={styles.cardInput} />
                  </Card.Content>
                </Card>
              ))}

              <Text style={styles.sectionTitle}>Education</Text>
              {resume.education.map((edu, index) => (
                <Card key={index} style={styles.subCard}>
                  <Card.Content>
                    <TextInput label="Degree" value={edu.degree} onChangeText={(text) => {
                      const updatedEducation = [...resume.education];
                      updatedEducation[index].degree = text;
                      setResume({ ...resume, education: updatedEducation });
                    }} mode="outlined" style={styles.cardInput} />
                    <TextInput label="Institution" value={edu.institution} onChangeText={(text) => {
                      const updatedEducation = [...resume.education];
                      updatedEducation[index].institution = text;
                      setResume({ ...resume, education: updatedEducation });
                    }} mode="outlined" style={styles.cardInput} />
                    <TextInput label="Remarks" multiline numberOfLines={3} value={edu.remarks} onChangeText={(text) => {
                      const updatedEducation = [...resume.education];
                      updatedEducation[index].remarks = text;
                      setResume({ ...resume, education: updatedEducation });
                    }} mode="outlined" style={styles.cardInput} />
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
});