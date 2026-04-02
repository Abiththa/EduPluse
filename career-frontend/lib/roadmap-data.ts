import type { CareerRoadmap } from "@/types/roadmap";

export const careerRoadmaps: CareerRoadmap[] = [
  {
    id: "full-stack-developer",
    name: "Full-Stack Developer",
    steps: [
      {
        id: "fs-1",
        title: "Learn HTML, CSS, and JavaScript",
        description:
          "Build a strong foundation in core web technologies and page layouts.",
        type: "Skill",
      },
      {
        id: "fs-2",
        title: "Master React and Component Architecture",
        description:
          "Learn reusable UI design, hooks, state, props, and routing.",
        type: "Skill",
      },
      {
        id: "fs-3",
        title: "Learn Node.js and Express",
        description:
          "Build backend APIs, middleware, and server-side logic.",
        type: "Skill",
      },
      {
        id: "fs-4",
        title: "Work with Databases",
        description:
          "Use SQL or MongoDB to store, retrieve, and manage application data.",
        type: "Skill",
      },
      {
        id: "fs-5",
        title: "Build a Full-Stack Project",
        description:
          "Create a real-world app with frontend, backend, and database integration.",
        type: "Project",
      },
      {
        id: "fs-6",
        title: "Apply for Full-Stack Internship",
        description:
          "Start applying for internships and junior developer roles.",
        type: "Internship",
      },
    ],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    steps: [
      {
        id: "da-1",
        title: "Learn Python for Data Analysis",
        description:
          "Master pandas, numpy, and matplotlib for data manipulation and visualization.",
        type: "Skill",
      },
      {
        id: "da-2",
        title: "SQL Mastery",
        description:
          "Write complex queries, joins, window functions, and CTEs.",
        type: "Skill",
      },
      {
        id: "da-3",
        title: "Statistics & Probability",
        description:
          "Understand distributions, hypothesis testing, regression, and correlation.",
        type: "Skill",
      },
      {
        id: "da-4",
        title: "Build a Data Dashboard Project",
        description:
          "Create an interactive dashboard analyzing a real dataset.",
        type: "Project",
      },
      {
        id: "da-5",
        title: "Google Data Analytics Certificate",
        description:
          "Complete the Google Professional Certificate on Coursera.",
        type: "Certification",
      },
      {
        id: "da-6",
        title: "Learn Tableau / Power BI",
        description:
          "Create professional data visualizations and reports.",
        type: "Skill",
      },
      {
        id: "da-7",
        title: "Data Analysis Internship",
        description:
          "Apply for analyst roles to work with real business data.",
        type: "Internship",
      },
    ],
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    steps: [
      {
        id: "ux-1",
        title: "Learn Design Principles",
        description:
          "Understand typography, spacing, color, contrast, and alignment.",
        type: "Skill",
      },
      {
        id: "ux-2",
        title: "Master Figma",
        description:
          "Create wireframes, prototypes, auto layout systems, and components.",
        type: "Skill",
      },
      {
        id: "ux-3",
        title: "User Research Basics",
        description:
          "Learn user personas, interviews, surveys, and journey mapping.",
        type: "Skill",
      },
      {
        id: "ux-4",
        title: "Build a Case Study Portfolio",
        description:
          "Show your full design process from problem to prototype.",
        type: "Project",
      },
      {
        id: "ux-5",
        title: "Apply for Design Internship",
        description:
          "Start applying for UI/UX internship and junior designer roles.",
        type: "Internship",
      },
    ],
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    steps: [
      {
        id: "do-1",
        title: "Learn Linux Fundamentals",
        description:
          "Understand shell commands, permissions, system services, and scripting.",
        type: "Skill",
      },
      {
        id: "do-2",
        title: "Version Control with Git",
        description:
          "Learn branches, merges, pull requests, and team workflows.",
        type: "Skill",
      },
      {
        id: "do-3",
        title: "Docker and Containers",
        description:
          "Containerize apps and understand image creation and deployment.",
        type: "Skill",
      },
      {
        id: "do-4",
        title: "CI/CD Pipelines",
        description:
          "Use GitHub Actions or Jenkins to automate testing and deployment.",
        type: "Skill",
      },
      {
        id: "do-5",
        title: "Cloud Basics",
        description:
          "Learn AWS or Azure core services used in deployments.",
        type: "Certification",
      },
      {
        id: "do-6",
        title: "DevOps Internship",
        description:
          "Work with deployment, automation, and infrastructure teams.",
        type: "Internship",
      },
    ],
  },
  {
    id: "mobile-app-developer",
    name: "Mobile App Developer",
    steps: [
      {
        id: "ma-1",
        title: "Learn Mobile UI Fundamentals",
        description:
          "Understand layout, responsiveness, and mobile-first design.",
        type: "Skill",
      },
      {
        id: "ma-2",
        title: "Learn Flutter or React Native",
        description:
          "Build cross-platform apps with reusable components.",
        type: "Skill",
      },
      {
        id: "ma-3",
        title: "State Management",
        description:
          "Use provider, bloc, context, or redux patterns in apps.",
        type: "Skill",
      },
      {
        id: "ma-4",
        title: "Build a Mobile App Project",
        description:
          "Create a complete app with authentication and API integration.",
        type: "Project",
      },
      {
        id: "ma-5",
        title: "Publish / Prepare for Store Release",
        description:
          "Learn build signing, app assets, metadata, and deployment basics.",
        type: "Certification",
      },
      {
        id: "ma-6",
        title: "Apply for Mobile Internship",
        description:
          "Apply for cross-platform or Android/iOS developer roles.",
        type: "Internship",
      },
    ],
  },
];