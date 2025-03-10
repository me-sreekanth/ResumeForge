import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
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

export default function ResumeFormScreen() {
  const [resume, setResume] = useState<Resume>({
    name: "",
    current_position: "",
    contact: {
      email: "",
      phone: "",
      linkedin: "",
      github: "",
    },
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
      if (savedResume) {
        setResume(savedResume);
      }
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
      setResume({
        ...uploadedData,
        skills: uploadedData.skills ? uploadedData.skills : [],
      });
      Alert.alert("Success", "Resume loaded from file!");
    } else {
      Alert.alert("Error", "Invalid JSON file or upload canceled.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Resume Details</Text>

          <Button title="Upload JSON Resume" onPress={handleUploadJson} />

          <TextInput
            placeholder="Full Name"
            value={resume.name}
            onChangeText={(text) => setResume({ ...resume, name: text })}
            style={styles.input}
          />

          <TextInput
            placeholder="Current Position"
            value={resume.current_position}
            onChangeText={(text) => setResume({ ...resume, current_position: text })}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput placeholder="Email" value={resume.contact.email} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, email: text } })} style={styles.input} />
          <TextInput placeholder="Phone" value={resume.contact.phone} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, phone: text } })} style={styles.input} />
          <TextInput placeholder="LinkedIn" value={resume.contact.linkedin} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, linkedin: text } })} style={styles.input} />
          <TextInput placeholder="GitHub" value={resume.contact.github} onChangeText={(text) => setResume({ ...resume, contact: { ...resume.contact, github: text } })} style={styles.input} />

          <Text style={styles.sectionTitle}>Summary</Text>
          <TextInput placeholder="Summary" multiline value={resume.summary} onChangeText={(text) => setResume({ ...resume, summary: text })} style={styles.input} />

          <Text style={styles.sectionTitle}>Skills</Text>
          <TextInput placeholder="Skills (comma-separated)" value={resume.skills.join(", ")} onChangeText={(text) => setResume({ ...resume, skills: text.split(", ") })} style={styles.input} />

          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((exp, index) => (
            <View key={index} style={styles.card}>
              <TextInput placeholder="Job Title" value={exp.title} onChangeText={(text) => {
                const updatedExperience = [...resume.experience];
                updatedExperience[index] = { ...updatedExperience[index], title: text };
                setResume({ ...resume, experience: updatedExperience });
              }} style={styles.cardInput} />
              <TextInput placeholder="Company" value={exp.company} onChangeText={(text) => {
                const updatedExperience = [...resume.experience];
                updatedExperience[index] = { ...updatedExperience[index], company: text };
                setResume({ ...resume, experience: updatedExperience });
              }} style={styles.cardInput} />
              <TextInput placeholder="Years" value={exp.years} onChangeText={(text) => {
                const updatedExperience = [...resume.experience];
                updatedExperience[index] = { ...updatedExperience[index], years: text };
                setResume({ ...resume, experience: updatedExperience });
              }} style={styles.cardInput} />
              {exp.details.map((detail, detailIndex) => (
                <TextInput key={detailIndex} placeholder="Detail" value={detail} onChangeText={(text) => {
                  const updatedExperience = [...resume.experience];
                  updatedExperience[index].details[detailIndex] = text;
                  setResume({ ...resume, experience: updatedExperience });
                }} style={styles.detailInput} />
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Achievements</Text>
          {resume.achievements.map((achievement, index) => (
            <TextInput
              key={index}
              placeholder="Achievement"
              value={achievement}
              onChangeText={(text) => {
                const updatedAchievements = [...resume.achievements];
                updatedAchievements[index] = text;
                setResume({ ...resume, achievements: updatedAchievements });
              }}
              style={styles.input}
            />
          ))}

          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((edu, index) => (
            <View key={index} style={styles.card}>
              <TextInput placeholder="Degree" value={edu.degree} onChangeText={(text) => {
                const updatedEducation = [...resume.education];
                updatedEducation[index].degree = text;
                setResume({ ...resume, education: updatedEducation });
              }} style={styles.cardInput} />
              <TextInput placeholder="Institution" value={edu.institution} onChangeText={(text) => {
                const updatedEducation = [...resume.education];
                updatedEducation[index].institution = text;
                setResume({ ...resume, education: updatedEducation });
              }} style={styles.cardInput} />
              <TextInput placeholder="Year" value={edu.year} onChangeText={(text) => {
                const updatedEducation = [...resume.education];
                updatedEducation[index].year = text;
                setResume({ ...resume, education: updatedEducation });
              }} style={styles.cardInput} />
            </View>
          ))}

          <Button title="Save Resume" onPress={handleSave} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  card: { backgroundColor: "#f9f9f9", padding: 10, marginVertical: 5, borderRadius: 8 },
  cardInput: { borderBottomWidth: 1, padding: 6, marginBottom: 5 },
  detailInput: { backgroundColor: "#fff", padding: 8, marginBottom: 5, borderRadius: 5, borderWidth: 1, borderColor: "#ddd" },
});
