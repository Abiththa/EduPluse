import {
  FileText,
  Map,
  BarChart3,
  Briefcase,
  Wrench,
} from "lucide-react";

export const studentProfile = {
  name: "Amal Perera",
  email: "amal@edupulse.lk",
  role: "Student",
};

export const dashboardFeatures = [
  {
    title: "CV Builder",
    description: "Create and manage your professional CVs",
    href: "/student/cv-builder",
    icon: FileText,
  },
  {
    title: "Career Roadmap",
    description: "Follow a step-by-step path to your goal",
    href: "/student/roadmap",
    icon: Map,
  },
  {
    title: "Resume Score",
    description: "Get your CV scored and improved",
    href: "/student/resume-score",
    icon: BarChart3,
  },
  {
    title: "Job Suggestions",
    description: "Discover roles that match your skills",
    href: "/student/job-suggestions",
    icon: Briefcase,
  },
  {
    title: "Skill Management",
    description: "Track and level up your skills",
    href: "/student/skills",
    icon: Wrench,
  },
];