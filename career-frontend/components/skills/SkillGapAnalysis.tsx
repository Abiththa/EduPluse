import { AlertCircle } from "lucide-react";
import type { Skill } from "@/types/skill";

type MissingSkillItem = {
  name: string;
  requiredLevel: string;
  status: "Missing";
};

type SkillGapAnalysisProps = {
  selectedRole: string;
  onChangeRole: (value: string) => void;
  roles: string[];
  missingSkills: MissingSkillItem[];
  userSkills: Skill[];
};

export default function SkillGapAnalysis({
  selectedRole,
  onChangeRole,
  roles,
  missingSkills,
  userSkills,
}: SkillGapAnalysisProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[18px] font-semibold text-slate-900">
          Skill Gap Analysis
        </h2>

        <select
          value={selectedRole}
          onChange={(e) => onChangeRole(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {missingSkills.length === 0 ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
          Great job. You currently have all listed skills for {selectedRole}.
        </div>
      ) : (
        <div className="space-y-1">
          {missingSkills.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col gap-2 border-b border-slate-200 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-[15px] font-medium text-slate-800">
                  {skill.name}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500">
                  Required: {skill.requiredLevel.toLowerCase()}
                </span>
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                  {skill.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {userSkills.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Add your skills above to get a better gap analysis.
        </p>
      ) : null}
    </div>
  );
}