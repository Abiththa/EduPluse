import type { RequiredSkill, TargetRole } from "@/types/skill";

export const targetRoles: TargetRole[] = [
  "Full-Stack Developer",
  "Data Analyst",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
];

export const roleSkillRequirements: Record<TargetRole, RequiredSkill[]> = {
  "Full-Stack Developer": [
    { name: "HTML", requiredLevel: "Advanced" },
    { name: "CSS", requiredLevel: "Advanced" },
    { name: "JavaScript", requiredLevel: "Advanced" },
    { name: "React", requiredLevel: "Intermediate" },
    { name: "Node.js", requiredLevel: "Intermediate" },
    { name: "SQL", requiredLevel: "Intermediate" },
    { name: "Git", requiredLevel: "Intermediate" },
    { name: "TypeScript", requiredLevel: "Beginner" },
  ],
  "Data Analyst": [
    { name: "Python", requiredLevel: "Intermediate" },
    { name: "SQL", requiredLevel: "Intermediate" },
    { name: "Excel", requiredLevel: "Intermediate" },
    { name: "Tableau", requiredLevel: "Beginner" },
    { name: "Power BI", requiredLevel: "Beginner" },
    { name: "Statistics", requiredLevel: "Intermediate" },
  ],
  "UI/UX Designer": [
    { name: "Figma", requiredLevel: "Advanced" },
    { name: "User Research", requiredLevel: "Intermediate" },
    { name: "Prototyping", requiredLevel: "Intermediate" },
    { name: "Wireframing", requiredLevel: "Intermediate" },
    { name: "Typography", requiredLevel: "Beginner" },
    { name: "Design Systems", requiredLevel: "Beginner" },
  ],
  "DevOps Engineer": [
    { name: "Linux", requiredLevel: "Intermediate" },
    { name: "Git", requiredLevel: "Intermediate" },
    { name: "Docker", requiredLevel: "Intermediate" },
    { name: "CI/CD", requiredLevel: "Intermediate" },
    { name: "AWS", requiredLevel: "Beginner" },
    { name: "Shell Scripting", requiredLevel: "Intermediate" },
  ],
  "Mobile App Developer": [
    { name: "Flutter", requiredLevel: "Intermediate" },
    { name: "React Native", requiredLevel: "Intermediate" },
    { name: "Firebase", requiredLevel: "Beginner" },
    { name: "API Integration", requiredLevel: "Intermediate" },
    { name: "Mobile UI", requiredLevel: "Intermediate" },
  ],
};

export function getLevelRank(level: string) {
  switch (level) {
    case "Beginner":
      return 1;
    case "Intermediate":
      return 2;
    case "Advanced":
      return 3;
    default:
      return 0;
  }
}