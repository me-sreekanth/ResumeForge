import AsyncStorage from "@react-native-async-storage/async-storage";

const RESUME_KEY = "resumeData";
const HISTORY_KEY = "resumeHistory";

// Save the resume data
export const saveResume = async (resumeData: any) => {
  try {
    const jsonValue = JSON.stringify(resumeData);
    await AsyncStorage.setItem(RESUME_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving resume:", error);
  }
};

// Load the resume data
export const loadResume = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(RESUME_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error loading resume:", error);
  }
};

// Save to history
export const addHistoryEntry = async (resumeData: any) => {
  try {
    const history = await getHistory();
    const timestamp = new Date().toISOString();
    const newHistory = [{ timestamp, data: resumeData }, ...history];
    
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving history:", error);
  }
};

// Get history
export const getHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
};
