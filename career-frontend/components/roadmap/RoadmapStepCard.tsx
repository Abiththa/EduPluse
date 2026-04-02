import {
  BookOpen,
  FolderKanban,
  Award,
  Briefcase,
  Check,
} from "lucide-react";
import type { RoadmapStep } from "@/types/roadmap";

type RoadmapStepCardProps = {
  step: RoadmapStep;
  completed: boolean;
  onToggle: (stepId: string) => void;
};

function getTypeIcon(type: RoadmapStep["type"]) {
  switch (type) {
    case "Skill":
      return BookOpen;
    case "Project":
      return FolderKanban;
    case "Certification":
      return Award;
    case "Internship":
      return Briefcase;
    default:
      return BookOpen;
  }
}

function getTypeBadgeStyle(type: RoadmapStep["type"]) {
  switch (type) {
    case "Skill":
      return "bg-sky-50 text-sky-600";
    case "Project":
      return "bg-emerald-50 text-emerald-600";
    case "Certification":
      return "bg-amber-50 text-amber-600";
    case "Internship":
      return "bg-teal-50 text-teal-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function RoadmapStepCard({
  step,
  completed,
  onToggle,
}: RoadmapStepCardProps) {
  if (!step) return null;

  const Icon = getTypeIcon(step.type);

  return (
    <div className="relative pl-14">
      <div className="absolute left-5 top-0 h-full w-px bg-slate-200" />

      <button
        type="button"
        onClick={() => onToggle(step.id)}
        className={`absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition ${
          completed
            ? "border-sky-500 bg-sky-500 text-white"
            : "border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100"
        }`}
      >
        {completed ? <Check size={18} /> : <Icon size={18} />}
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h3
            className={`text-[18px] font-semibold ${
              completed ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {step.title}
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadgeStyle(
              step.type
            )}`}
          >
            {step.type}
          </span>
        </div>

        <p
          className={`text-[15px] ${
            completed ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}