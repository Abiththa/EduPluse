"use client";

import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import RoadmapStepForm from "@/components/admin/roadmaps/RoadmapStepForm";
import type { AdminRoadmap, AdminRoadmapStep } from "@/types/admin";

type RoadmapCardProps = {
  roadmap: AdminRoadmap;
  onDeleteRoadmap: (id: string) => void;
  onSaveStep: (roadmapId: string, step: AdminRoadmapStep) => void;
  onDeleteStep: (roadmapId: string, stepId: string) => void;
};

export default function RoadmapCard({
  roadmap,
  onDeleteRoadmap,
  onSaveStep,
  onDeleteStep,
}: RoadmapCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingStep, setEditingStep] = useState<AdminRoadmapStep | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);

  const handleAddStep = () => {
    setEditingStep(null);
    setShowStepForm(true);
    setExpanded(true);
  };

  const handleEditStep = (step: AdminRoadmapStep) => {
    setEditingStep(step);
    setShowStepForm(true);
    setExpanded(true);
  };

  const handleCancelStep = () => {
    setEditingStep(null);
    setShowStepForm(false);
  };

  const handleSaveStep = (step: AdminRoadmapStep) => {
    onSaveStep(roadmap.id, step);
    setEditingStep(null);
    setShowStepForm(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-semibold text-slate-900">
            {roadmap.careerRoleName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {roadmap.steps.length} steps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteRoadmap(roadmap.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-4">
          {showStepForm ? (
            <RoadmapStepForm
              initialStep={editingStep}
              onSave={handleSaveStep}
              onCancel={handleCancelStep}
            />
          ) : null}

          <div className="space-y-3">
            {roadmap.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
              >
                <div className="pr-4">
                  <p className="text-[15px] font-medium text-slate-900">
                    {index + 1}. {step.title}{" "}
                    <span className="text-slate-400">({step.type})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditStep(step)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteStep(roadmap.id, step.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddStep}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus size={16} />
            Add Step
          </button>
        </div>
      ) : null}
    </div>
  );
}