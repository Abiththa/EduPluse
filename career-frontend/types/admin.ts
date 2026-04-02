export type AdminTemplate = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
};

export type AdminSkillLevel = "beginner" | "intermediate" | "advanced";

export type AdminRoleSkill = {
  name: string;
  level: AdminSkillLevel;
};

export type AdminCareerRole = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  requiredSkills: AdminRoleSkill[];
};

export type AdminRoadmapStepType =
  | "Skill"
  | "Project"
  | "Certification"
  | "Internship";

export type AdminRoadmapStep = {
  id: string;
  title: string;
  description: string;
  type: AdminRoadmapStepType;
};

export type AdminRoadmap = {
  id: string;
  careerRoleId: string;
  careerRoleName: string;
  steps: AdminRoadmapStep[];
};