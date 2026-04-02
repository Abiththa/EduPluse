import { Briefcase, MapPin, Percent } from "lucide-react";
import MissingSkillsTag from "./MissingSkillsTag";

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  match: number;
  description: string;
  missingSkills: string[];
};

export default function JobCard({
  title,
  company,
  location,
  match,
  description,
  missingSkills,
}: JobCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Briefcase size={16} />
              {company}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} />
              {location}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600">
          <Percent size={16} />
          {match}% Match
        </div>
      </div>

      <p className="text-slate-600 leading-7">{description}</p>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold text-slate-800">
          Missing Skills
        </p>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill) => (
            <MissingSkillsTag key={skill} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}