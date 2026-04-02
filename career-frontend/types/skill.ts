export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
}

export interface RequiredSkill {
  name: string;
  requiredLevel: SkillLevel;
}

export type TargetRole =
  | "Full-Stack Developer"
  | "Data Analyst"
  | "UI/UX Designer"
  | "DevOps Engineer"
  | "Mobile App Developer";