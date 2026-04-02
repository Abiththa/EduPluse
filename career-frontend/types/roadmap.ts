export type RoadmapStepType =
  | "Skill"
  | "Project"
  | "Certification"
  | "Internship";

export type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  type: RoadmapStepType;
};

export type CareerRoadmap = {
  id: string;
  careerRoleId: string;
  careerRoleName: string;
  steps: RoadmapStep[];
};