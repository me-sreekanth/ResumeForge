import { Resume } from "../shared/types/Resume";

//src/navigation/RootStackParamList.ts
export type RootStackParamList = {
    ResumeForm: undefined;
    PDFPreview: { resume: Resume };
  };