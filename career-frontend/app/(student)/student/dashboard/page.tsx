"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import FeatureCard from "@/components/dashboard/FeatureCard";
import { dashboardFeatures } from "@/lib/mock-data";
import { getMockSession } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

type BackendCv = {
  _id: string;
};

type BackendSkill = {
  _id: string;
};

type BackendCareer = {
  _id: string;
  title: string;
};

type BackendRoadmap = {
  _id: string;
  steps: unknown[];
};

type BackendProgress = {
  completedStepIndexes: number[];
  totalSteps: number;
  completedCount: number;
  completionPercentage: number;
};

export default function StudentDashboardPage() {
  const [cvCount, setCvCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [completion, setCompletion] = useState(0);
  const [studentName, setStudentName] = useState("Student");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = getMockSession();
    if (session?.name) {
      setStudentName(session.name);
    }

    const loadDashboardData = async () => {
      try {
        setIsLoaded(false);

        const [cvRes, skillsRes, careersRes] = await Promise.all([
          apiFetch("/cv"),
          apiFetch("/skills"),
          apiFetch("/careers"),
        ]);

        const cvs = (cvRes.data || []) as BackendCv[];
        const skills = (skillsRes.data || []) as BackendSkill[];
        const careers = (careersRes.data || []) as BackendCareer[];

        setCvCount(cvs.length);
        setSkillCount(skills.length);

        if (careers.length === 0) {
          setCompletion(0);
          return;
        }

        const roadmapAndProgressResults = await Promise.all(
          careers.map(async (career) => {
            try {
              const [roadmapRes, progressRes] = await Promise.all([
                apiFetch(`/careers/${career._id}/roadmap`),
                apiFetch(`/careers/${career._id}/progress`),
              ]);

              return {
                roadmap: roadmapRes.data as BackendRoadmap,
                progress: progressRes.data as BackendProgress,
              };
            } catch {
              return null;
            }
          })
        );

        const validResults = roadmapAndProgressResults.filter(
          (item): item is { roadmap: BackendRoadmap; progress: BackendProgress } =>
            item !== null
        );

        const totalSteps = validResults.reduce(
          (sum, item) => sum + (item.roadmap.steps?.length || 0),
          0
        );

        const completedSteps = validResults.reduce(
          (sum, item) => sum + (item.progress.completedCount || 0),
          0
        );

        const completionPercentage =
          totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

        setCompletion(completionPercentage);
      } catch (error) {
        console.error("Failed to load student dashboard data:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setIsLoaded(true);
      }
    };

    loadDashboardData();
  }, []);

  const stats = useMemo(() => {
    return [
      {
        title: "CVs Created",
        value: String(cvCount),
      },
      {
        title: "Skills Tracked",
        value: String(skillCount),
      },
      {
        title: "Completion",
        value: `${completion}%`,
      },
    ];
  }, [cvCount, skillCount, completion]);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${studentName}`}
        subtitle="Manage your career journey from one place."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoaded ? (
          stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))
        ) : (
          <>
            <StatCard title="CVs Created" value="0" />
            <StatCard title="Skills Tracked" value="0" />
            <StatCard title="Completion" value="0%" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dashboardFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              icon={<Icon size={20} strokeWidth={1.8} />}
            />
          );
        })}
      </div>
    </div>
  );
}