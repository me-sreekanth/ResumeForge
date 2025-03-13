export type Experience = {
  title: string;
  company: string;
  location: string;  // ✅ Add this field
  years: string;
  details: string[];
};

  
  export type Project = {
    name: string;
    description: string;
  };
  
  export type Education = {
    degree: string;
    institution: string;
    year: string;
    grade?: string;
    remarks?: string;
  };
  
  export type Contact = {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  
  export type Resume = {
    name: string;
    current_position: string;
    contact: Contact;
    summary: string;
    skills: string[];
    experience: Experience[];
    projects: Project[];
    education: Education[];
    achievements: string[];
  };
  