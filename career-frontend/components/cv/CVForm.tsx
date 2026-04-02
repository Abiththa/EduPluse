import { CVData } from "@/types/cv";
import PersonalInfoForm from "./PersonalInfoForm";
import SummaryForm from "./SummaryForm";
import EducationForm from "./EducationForm";
import ExperienceForm from "./ExperienceForm";
import SkillsForm from "./SkillsForm";
import ProjectForm from "./ProjectForm";

type CVFormProps = {
  data: CVData;
};

export default function CVForm({ data }: CVFormProps) {
  return (
    <div className="space-y-6">
      <PersonalInfoForm data={data.personalInfo} />
      <SummaryForm value={data.summary} />
      <EducationForm items={data.education} />
      <ExperienceForm items={data.experience} />
      <SkillsForm items={data.skills} />
      <ProjectForm items={data.projects} />
    </div>
  );
}