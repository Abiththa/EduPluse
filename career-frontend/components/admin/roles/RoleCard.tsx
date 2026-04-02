import { Pencil, Trash2 } from "lucide-react";
import type { AdminCareerRole } from "@/types/admin";

type RoleCardProps = {
  role: AdminCareerRole;
  onEdit: (role: AdminCareerRole) => void;
  onDelete: (id: string) => void;
};

function formatSkill(skill: { name: string; level: string }) {
  return `${skill.name} (${skill.level})`;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-slate-900">
            {role.title}
          </h3>

          <p className="mt-2 text-[15px] text-slate-500">{role.description}</p>

          {role.requiredSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {role.requiredSkills.map((skill, index) => (
                <span
                  key={`${skill.name}-${index}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500"
                >
                  {formatSkill(skill)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(role)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(role.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}