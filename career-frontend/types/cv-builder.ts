export type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  position: string;
  start: string;
  end: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  link: string;
  description: string;
  technologies: string;
};

export type CVState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
  skillInput: string;
};