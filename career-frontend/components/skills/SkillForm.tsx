"use client";

import type { SkillLevel } from "@/types/skill";

type SkillFormProps = {
  skillName: string;
  skillLevel: SkillLevel;
  skillCategory: string;
  onChangeName: (value: string) => void;
  onChangeLevel: (value: SkillLevel) => void;
  onChangeCategory: (value: string) => void;
  onAdd: () => void;
};

export default function SkillForm({
  skillName,
  skillLevel,
  skillCategory,
  onChangeName,
  onChangeLevel,
  onChangeCategory,
  onAdd,
}: SkillFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[18px] font-semibold text-slate-900">Add a Skill</h2>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_0.35fr_0.45fr_auto]">
        <input
          type="text"
          value={skillName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Skill name..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
        />

        <select
          value={skillLevel}
          onChange={(e) => onChangeLevel(e.target.value as SkillLevel)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <input
          type="text"
          value={skillCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          placeholder="Category (optional)"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
        />

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          + Add
        </button>
      </div>
    </div>
  );
}