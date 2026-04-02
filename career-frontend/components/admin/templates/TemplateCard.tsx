import { FileText } from "lucide-react";
import type { AdminTemplate } from "@/types/admin";

type Props = {
  template: AdminTemplate;
  onToggleStatus: (id: string) => void;
};

export default function TemplateCard({ template, onToggleStatus }: Props) {
  const isActive = template.status === "active";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
            <FileText size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {template.name}
            </h3>
            <p className="text-sm text-slate-500">
              {template.description}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <button
        onClick={() => onToggleStatus(template.id)}
        className={`w-full rounded-xl px-4 py-2 text-sm font-semibold ${
          isActive
            ? "border border-red-200 text-red-500 hover:bg-red-50"
            : "bg-sky-500 text-white hover:bg-sky-600"
        }`}
      >
        {isActive ? "Disable Template" : "Enable Template"}
      </button>
    </div>
  );
}