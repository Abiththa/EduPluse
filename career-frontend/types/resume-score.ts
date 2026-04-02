export type SavedCVForScoring = {
  id: string;
  template?: string;
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    start: string;
    end: string;
  }>;
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    start: string;
    end: string;
    description: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    link: string;
    description: string;
    technologies: string;
  }>;
  skills?: string[];
  status: string;
  updatedAt: string;
};

export type ResumeScoreSection = {
  title: string;
  score: number;
  feedback: string;
};

export type ResumeScoreAnalysis = {
  score: number;
  rating: string;
  sections: ResumeScoreSection[];
  suggestions: string[];
  missingKeywords: string[];
  matchedKeywords?: string[];
};