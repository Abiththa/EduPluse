"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { AdminRoadmapStep, AdminRoadmapStepType } from "@/types/admin";

type RoadmapStepFormProps = {
  initialStep: AdminRoadmapStep | null;
  onSave: (step: AdminRoadmapStep) => void;
  onCancel: () => void;
};

export default function RoadmapStepForm({
  initialStep,
  onSave,
  onCancel,
}: RoadmapStepFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AdminRoadmapStepType>("Skill");

  useEffect(() => {
    if (initialStep) {
      setTitle(initialStep.title);
      setDescription(initialStep.description);
      setType(initialStep.type);
    } else {
      setTitle("");
      setDescription("");
      setType("Skill");
    }
  }, [initialStep]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter step title");
      return;
    }

    onSave({
      id: initialStep?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      type,
    });
  };

  return (
    <div className="mb-4 rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[17px] font-semibold text-slate-900">
          {initialStep ? "Edit Step" : "Add Step"}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Step Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AdminRoadmapStepType)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          >
            <option value="Skill">Skill</option>
            <option value="Project">Project</option>
            <option value="Certification">Certification</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}