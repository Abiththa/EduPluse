"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import RoadmapCard from "@/components/admin/roadmaps/RoadmapCard";
import { apiFetch } from "@/lib/api";
import type {
  AdminCareerRole,
  AdminRoadmap,
  AdminRoadmapStep,
} from "@/types/admin";

type BackendCareerRole = {
  _id: string;
  title: string;
  description?: string;
};

type BackendRoadmapStep = {
  title: string;
  skills?: string[];
  certifications?: string[];
  projects?: string[];
  resources?: string[];
};

type BackendRoadmap = {
  _id: string;
  careerRoleId?: {
    _id: string;
    title: string;
    description?: string;
  };
  steps: BackendRoadmapStep[];
};

type NormalizedRoadmap = AdminRoadmap;

function buildStepDescription(step: BackendRoadmapStep) {
  const parts: string[] = [];

  if (step.skills?.length) {
    parts.push(`Skills: ${step.skills.join(", ")}`);
  }

  if (step.certifications?.length) {
    parts.push(`Certifications: ${step.certifications.join(", ")}`);
  }

  if (step.projects?.length) {
    parts.push(`Projects: ${step.projects.join(", ")}`);
  }

  if (step.resources?.length) {
    parts.push(`Resources: ${step.resources.join(", ")}`);
  }

  return parts.join(". ");
}

function getStepType(step: BackendRoadmapStep): AdminRoadmapStep["type"] {
  if (step.certifications?.length) return "Certification";
  if (step.projects?.length) return "Project";
  if (step.skills?.length) return "Skill";
  return "Internship";
}

function mapBackendRoadmapToUi(item: BackendRoadmap): NormalizedRoadmap {
  return {
    id: item._id,
    careerRoleId: item.careerRoleId?._id || "",
    careerRoleName: item.careerRoleId?.title || "Untitled Role",
    steps: (item.steps || []).map((step, index) => ({
      id: `step-${index}`,
      title: step.title,
      description:
        buildStepDescription(step) ||
        "Complete this step to move forward in the roadmap.",
      type: getStepType(step),
    })),
  };
}

function mapBackendRoleToUi(role: BackendCareerRole): AdminCareerRole {
  return {
    id: role._id,
    title: role.title,
    description: role.description || "",
    keywords: [],
    requiredSkills: [],
  };
}

function mapUiStepsToBackend(steps: AdminRoadmapStep[]): BackendRoadmapStep[] {
  return steps.map((step) => {
    switch (step.type) {
      case "Certification":
        return {
          title: step.title,
          certifications: [step.description || step.title],
          skills: [],
          projects: [],
          resources: [],
        };
      case "Project":
        return {
          title: step.title,
          projects: [step.description || step.title],
          skills: [],
          certifications: [],
          resources: [],
        };
      case "Internship":
        return {
          title: step.title,
          resources: [step.description || step.title],
          skills: [],
          certifications: [],
          projects: [],
        };
      case "Skill":
      default:
        return {
          title: step.title,
          skills: [step.description || step.title],
          certifications: [],
          projects: [],
          resources: [],
        };
    }
  });
}

export default function AdminRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<NormalizedRoadmap[]>([]);
  const [roles, setRoles] = useState<AdminCareerRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPageData = async () => {
    try {
      setLoading(true);

      const [roadmapsRes, careersRes] = await Promise.all([
        apiFetch("/admin/roadmaps"),
        apiFetch("/admin/careers"),
      ]);

      const fetchedRoadmaps = ((roadmapsRes.data || []) as BackendRoadmap[]).map(
        mapBackendRoadmapToUi
      );

      const fetchedRoles = ((careersRes.data || []) as BackendCareerRole[]).map(
        mapBackendRoleToUi
      );

      setRoadmaps(fetchedRoadmaps);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to load admin roadmaps:", error);
      alert(
        error instanceof Error ? error.message : "Failed to load admin roadmaps"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const sortedRoadmaps = useMemo(() => {
    return [...roadmaps].sort((a, b) =>
      (a.careerRoleName || "").localeCompare(b.careerRoleName || "")
    );
  }, [roadmaps]);

  const handleAddRoadmap = async () => {
    const availableRole = roles.find(
      (role) => !roadmaps.some((roadmap) => roadmap.careerRoleId === role.id)
    );

    if (!availableRole) {
      alert("No available career role left. Create a new role first.");
      return;
    }

    try {
      await apiFetch("/admin/roadmaps", {
        method: "POST",
        body: JSON.stringify({
          careerRoleId: availableRole.id,
          steps: [],
        }),
      });

      await loadPageData();
    } catch (error) {
      console.error("Failed to create roadmap:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create roadmap"
      );
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    try {
      await apiFetch(`/admin/roadmaps/${id}`, {
        method: "DELETE",
      });

      setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== id));
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete roadmap"
      );
    }
  };

  const handleSaveStep = async (roadmapId: string, step: AdminRoadmapStep) => {
    const roadmap = roadmaps.find((item) => item.id === roadmapId);

    if (!roadmap) return;

    const exists = roadmap.steps.some((existing) => existing.id === step.id);

    const updatedSteps = exists
      ? roadmap.steps.map((existing) =>
          existing.id === step.id ? step : existing
        )
      : [...roadmap.steps, step];

    try {
      await apiFetch(`/admin/roadmaps/${roadmapId}`, {
        method: "PUT",
        body: JSON.stringify({
          careerRoleId: roadmap.careerRoleId,
          steps: mapUiStepsToBackend(updatedSteps),
        }),
      });

      setRoadmaps((prev) =>
        prev.map((item) =>
          item.id === roadmapId
            ? {
                ...item,
                steps: updatedSteps,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to save roadmap step:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save roadmap step"
      );
      await loadPageData();
    }
  };

  const handleDeleteStep = async (roadmapId: string, stepId: string) => {
    const roadmap = roadmaps.find((item) => item.id === roadmapId);

    if (!roadmap) return;

    const updatedSteps = roadmap.steps.filter((step) => step.id !== stepId);

    try {
      await apiFetch(`/admin/roadmaps/${roadmapId}`, {
        method: "PUT",
        body: JSON.stringify({
          careerRoleId: roadmap.careerRoleId,
          steps: mapUiStepsToBackend(updatedSteps),
        }),
      });

      setRoadmaps((prev) =>
        prev.map((item) =>
          item.id === roadmapId
            ? {
                ...item,
                steps: updatedSteps,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to delete roadmap step:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete roadmap step"
      );
      await loadPageData();
    }
  };

  return (
    <div>
      <PageHeader
        title="Career Roadmaps"
        subtitle="Manage step-by-step career roadmaps."
        action={
          <button
            type="button"
            onClick={handleAddRoadmap}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            + Add Roadmap
          </button>
        }
      />

      {loading ? null : sortedRoadmaps.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No roadmaps found.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onDeleteRoadmap={handleDeleteRoadmap}
              onSaveStep={handleSaveStep}
              onDeleteStep={handleDeleteStep}
            />
          ))}
        </div>
      )}
    </div>
  );
}