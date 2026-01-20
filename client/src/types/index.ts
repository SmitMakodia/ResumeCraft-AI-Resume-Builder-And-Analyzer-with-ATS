export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Link {
  name: string;
  url: string;
}

export interface Experience {
  _id?: string;
  id: string;
  company: string;
  position: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  isCurrent: boolean;
  description: string[];
  achievements: string[];
}

export interface Education {
  _id?: string;
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  achievements: string[];
}

export interface Project {
  _id?: string;
  id: string;
  name: string;
  tools: string[];
  date: string;
  description: string[];
  link: string;
}

export interface PersonalInfo {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  links: Link[];
  showIcons: boolean;
}

export interface SkillLine {
  heading: string;
  items: string[];
}

export interface Formatting {
  fontFamily: string;
  fontSize: string;
  lineHeight: number;
  sectionSpacing: number;
  itemSpacing: number;
  sectionOrder: string[];
  margins: number;
  paperSize: 'a4' | 'letter';
}

export interface Resume {
  _id?: string;
  userId?: string;
  title: string;
  template: 'classic' | 'modern' | 'minimal' | 'minimal-image' | 'tech-focused';
  accentColor: string;
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillLine[];
  formatting: Formatting;
  public: boolean;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}