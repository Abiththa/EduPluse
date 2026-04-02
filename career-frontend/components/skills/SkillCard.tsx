"use client";

import { Trash2 } from "lucide-react";
import type { Skill, SkillLevel } from "@/types/skill";

type SkillCardProps = {
  skill: Skill;
  onChangeLevel: (id: string, level: SkillLevel) => void;
  onDelete: (id: string) => void;
};

export default function SkillCard({
  skill,
  onChangeLevel,
  onDelete,
}: SkillCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-semibold text-slate-900">
            {skill.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {skill.category || "Uncategorized"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={skill.level}
            onChange={(e) => onChangeLevel(skill.id, e.target.value as SkillLevel)}
            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button
            type="button"
            onClick={() => onDelete(skill.id)}
            className="text-slate-400 transition hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}