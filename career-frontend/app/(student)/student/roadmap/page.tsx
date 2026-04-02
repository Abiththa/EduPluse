"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import CareerTabs from "@/components/roadmap/CareerTabs";
import RoadmapProgress from "@/components/roadmap/RoadmapProgress";
import RoadmapStepCard from "@/components/roadmap/RoadmapStepCard";
import { apiFetch } from "@/lib/api";
import type { CareerRoadmap, RoadmapStep } from "@/types/roadmap";

type BackendCareer = {
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

type BackendProgress = {
  completedStepIndexes: number[];
  totalSteps: number;
  completedCount: number;
  completionPercentage: number;
};

function buildStepDescription(step: BackendRoadmapStep) {
  const parts: string[] = [];

  if (step.skills?.length) {
    parts.push(`Skills: ${step.skills.join(", ")}.`);
  }

  if (step.certifications?.length) {
    parts.push(`Certifications: ${step.certifications.join(", ")}.`);
  }

  if (step.projects?.length) {
    parts.push(`Projects: ${step.projects.join(", ")}.`);
  }

  if (step.resources?.length) {
    parts.push(`Resources: ${step.resources.join(", ")}.`);
  }

  if (parts.length === 0) {
    return "Complete this step to move forward in your selected career path.";
  }

  return parts.join(" ");
}

function getStepType(step: BackendRoadmapStep): RoadmapStep["type"] {
  if (step.certifications?.length) return "Certification";
  if (step.projects?.length) return "Project";
  if (step.skills?.length) return "Skill";
  return "Internship";
}

function mapRoadmap(roadmap: BackendRoadmap): CareerRoadmap {
  return {
    id: roadmap._id,
    careerRoleId: roadmap.careerRoleId?._id || "",
    careerRoleName: roadmap.careerRoleId?.title || "Untitled Role",
    steps: (roadmap.steps || []).map((step, index) => ({
      id: `step-${index}`,
      title: step.title,
      description: buildStepDescription(step),
      type: getStepType(step),
    })),
  };
}

export default function RoadmapPage() {
  const [careers, setCareers] = useState<BackendCareer[]>([]);
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCareer = useMemo(() => {
    return careers.find((career) => career.title === selectedCareer) || null;
  }, [selectedCareer, careers]);

  const activeRoadmap = useMemo(() => {
    return (
      roadmaps.find((roadmap) => roadmap.careerRoleName === selectedCareer) ||
      null
    );
  }, [selectedCareer, roadmaps]);

  const loadProgress = async (careerId: string) => {
    const res = await apiFetch(`/careers/${careerId}/progress`);
    const progress = res.data as BackendProgress;
    setCompletedIndexes(progress.completedStepIndexes || []);
  };

  const tryLoadRoadmapForCareer = async (careerId: string) => {
    try {
      const res = await apiFetch(`/careers/${careerId}/roadmap`);
      return mapRoadmap(res.data as BackendRoadmap);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Roadmap not found for this career role"
      ) {
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const careerRes = await apiFetch("/careers");
        const fetchedCareers = (careerRes.data || []) as BackendCareer[];
        setCareers(fetchedCareers);

        if (fetchedCareers.length === 0) {
          return;
        }

        let firstAvailableRoadmap: CareerRoadmap | null = null;

        for (const career of fetchedCareers) {
          const roadmap = await tryLoadRoadmapForCareer(career._id);
          if (roadmap) {
            firstAvailableRoadmap = roadmap;
            break;
          }
        }

        if (firstAvailableRoadmap) {
          setRoadmaps([firstAvailableRoadmap]);
          setSelectedCareer(firstAvailableRoadmap.careerRoleName);
          await loadProgress(firstAvailableRoadmap.careerRoleId);
        } else {
          setSelectedCareer("");
          setRoadmaps([]);
          setCompletedIndexes([]);
        }
      } catch (error) {
        console.error("Failed to load roadmap data:", error);
        alert(
          error instanceof Error ? error.message : "Failed to load roadmap data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const handleCareerChange = async () => {
      if (!activeCareer) return;

      try {
        const roadmap = await tryLoadRoadmapForCareer(activeCareer._id);

        if (!roadmap) {
          setRoadmaps((prev) =>
            prev.filter((item) => item.careerRoleId !== activeCareer._id)
          );
          setCompletedIndexes([]);
          return;
        }

        setRoadmaps((prev) => {
          const others = prev.filter(
            (item) => item.careerRoleId !== activeCareer._id
          );
          return [...others, roadmap];
        });

        await loadProgress(activeCareer._id);
      } catch (error) {
        console.error("Failed to load selected career roadmap:", error);
        alert(error instanceof Error ? error.message : "Failed to load roadmap");
      }
    };

    if (activeCareer) {
      handleCareerChange();
    }
  }, [selectedCareer]);

  if (loading) return null;

  if (!activeRoadmap) {
    return (
      <div>
        <PageHeader
          title="Career Roadmap"
          subtitle="Select a career goal and follow the structured path."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          No roadmaps available yet. Ask the admin to create a roadmap for at least one career role.
        </div>
      </div>
    );
  }

  const totalSteps = activeRoadmap.steps.length;
  const completedCount = completedIndexes.length;
  const progress =
    totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  return (
    <div>
      <PageHeader
        title="Career Roadmap"
        subtitle="Select a career goal and follow the structured path."
      />

      <CareerTabs
        items={careers.map((career) => career.title)}
        activeItem={selectedCareer}
        onChange={setSelectedCareer}
      />

      <RoadmapProgress
        title={activeRoadmap.careerRoleName}
        progress={progress}
        totalSteps={totalSteps}
        completedSteps={completedCount}
      />

      <div className="space-y-6">
        {activeRoadmap.steps.map((step, index) => (
          <RoadmapStepCard
            key={step.id}
            step={step}
            completed={completedIndexes.includes(index)}
            onToggle={async (stepId) => {
              if (!activeCareer || !activeRoadmap) return;

              const stepIndex = activeRoadmap.steps.findIndex(
                (step) => step.id === stepId
              );
              if (stepIndex === -1) return;

              const updatedIndexes = completedIndexes.includes(stepIndex)
                ? completedIndexes.filter((index) => index !== stepIndex)
                : [...completedIndexes, stepIndex].sort((a, b) => a - b);

              try {
                setCompletedIndexes(updatedIndexes);

                await apiFetch(`/careers/${activeCareer._id}/progress`, {
                  method: "PUT",
                  body: JSON.stringify({
                    completedStepIndexes: updatedIndexes,
                  }),
                });
              } catch (error) {
                console.error("Failed to update roadmap progress:", error);
                alert(
                  error instanceof Error
                    ? error.message
                    : "Failed to update roadmap progress"
                );
                await loadProgress(activeCareer._id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}