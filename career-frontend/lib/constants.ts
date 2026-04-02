import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  Briefcase,
  Wrench,
} from "lucide-react";

export const studentNavItems = [
  {
    label: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "CV Builder",
    href: "/student/cv-builder",
    icon: FileText,
  },
  {
    label: "Career Roadmap",
    href: "/student/roadmap",
    icon: Map,
  },
  {
    label: "Resume Score",
    href: "/student/resume-score",
    icon: BarChart3,
  },
  {
    label: "Job Suggestions",
    href: "/student/job-suggestions",
    icon: Briefcase,
  },
  {
    label: "Skills",
    href: "/student/skills",
    icon: Wrench,
  },
];