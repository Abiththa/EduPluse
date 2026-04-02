"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SkillForm from "@/components/skills/SkillForm";
import SkillCard from "@/components/skills/SkillCard";
import SkillGapAnalysis from "@/components/skills/SkillGapAnalysis";
import type { Skill, SkillLevel } from "@/types/skill";
import { getLevelRank } from "@/lib/skill-gap-data";
import { apiFetch } from "@/lib/api";

type BackendSkill = {
  _id: string;
  skillName: string;
  level: "beginner" | "intermediate" | "advanced";
};

type BackendRequiredSkill = {
  name: string;
  minLevel: "beginner" | "intermediate" | "advanced";
};

type BackendJobSuggestion = {
  _id: string;
  title: string;
  requiredSkills: BackendRequiredSkill[];
};

const toUiLevel = (level: string): SkillLevel => {
  const normalized = String(level).toLowerCase();

  if (normalized === "advanced") return "Advanced";
  if (normalized === "intermediate") return "Intermediate";
  return "Beginner";
};

const toApiLevel = (level: SkillLevel): "beginner" | "intermediate" | "advanced" => {
  const normalized = String(level).toLowerCase();

  if (normalized === "advanced") return "advanced";
  if (normalized === "intermediate") return "intermediate";
  return "beginner";
};

const mapBackendSkillToUi = (skill: BackendSkill): Skill => {
  return {
    id: skill._id,
    name: skill.skillName,
    level: toUiLevel(skill.level),
    category: "",
  };
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [skillCategory, setSkillCategory] = useState("");
  const [jobRoles, setJobRoles] = useState<BackendJobSuggestion[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSkills = async () => {
    const res = await apiFetch("/skills");
    const mappedSkills = (res.data || []).map(mapBackendSkillToUi);
    setSkills(mappedSkills);
  };

  const loadJobRoles = async () => {
    const res = await apiFetch("/jobs/suggestions");
    const roles = (res.data || []) as BackendJobSuggestion[];
    setJobRoles(roles);

    if (roles.length > 0) {
      setSelectedRole((current) => {
        const exists = roles.some((role) => role.title === current);
        return exists ? current : roles[0].title;
      });
    } else {
      setSelectedRole("");
    }
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadSkills(), loadJobRoles()]);
    } catch (error) {
      console.error("Failed to load skills page data:", error);
      alert(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleAddSkill = async () => {
    if (!skillName.trim()) {
      alert("Please enter a skill name");
      return;
    }

    try {
      setSubmitting(true);

      await apiFetch("/skills", {
        method: "POST",
        body: JSON.stringify({
          skillName: skillName.trim(),
          level: toApiLevel(skillLevel),
        }),
      });

      setSkillName("");
      setSkillLevel("Beginner");
      setSkillCategory("");

      await Promise.all([loadSkills(), loadJobRoles()]);
    } catch (error) {
      console.error("Failed to add skill:", error);
      alert(error instanceof Error ? error.message : "Failed to add skill");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await apiFetch(`/skills/${id}`, {
        method: "DELETE",
      });

      await Promise.all([loadSkills(), loadJobRoles()]);
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert(error instanceof Error ? error.message : "Failed to delete skill");
    }
  };

  const handleChangeSkillLevel = async (id: string, level: SkillLevel) => {
    const currentSkill = skills.find((skill) => skill.id === id);

    if (!currentSkill) return;

    try {
      await apiFetch(`/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          skillName: currentSkill.name,
          level: toApiLevel(level),
        }),
      });

      await Promise.all([loadSkills(), loadJobRoles()]);
    } catch (error) {
      console.error("Failed to update skill:", error);
      alert(error instanceof Error ? error.message : "Failed to update skill");
    }
  };

  const roleOptions = useMemo(() => {
    return jobRoles.map((role) => role.title);
  }, [jobRoles]);

  const missingSkills = useMemo(() => {
    const matchedRole = jobRoles.find((role) => role.title === selectedRole);
    const required = matchedRole?.requiredSkills || [];

    return required
      .filter((requiredSkill) => {
        const matchingSkill = skills.find(
          (userSkill) =>
            userSkill.name.trim().toLowerCase() ===
            requiredSkill.name.trim().toLowerCase()
        );

        if (!matchingSkill) return true;

        return (
          getLevelRank(matchingSkill.level) <
          getLevelRank(toUiLevel(requiredSkill.minLevel))
        );
      })
      .map((item) => ({
        name: item.name,
        requiredLevel:
          toUiLevel(item.minLevel).charAt(0).toUpperCase() +
          toUiLevel(item.minLevel).slice(1),
        status: "Missing" as const,
      }));
  }, [selectedRole, skills, jobRoles]);

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Skill Management"
          subtitle="Track your skills and identify gaps for your career goals."
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-700">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Skill Management"
        subtitle="Track your skills and identify gaps for your career goals."
      />

      <div className="space-y-6">
        <SkillForm
          skillName={skillName}
          skillLevel={skillLevel}
          skillCategory={skillCategory}
          onChangeName={setSkillName}
          onChangeLevel={setSkillLevel}
          onChangeCategory={setSkillCategory}
          onAdd={handleAddSkill}
        />

        {submitting && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 shadow-sm">
            Saving skill...
          </div>
        )}

        {skills.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onChangeLevel={handleChangeSkillLevel}
                onDelete={handleDeleteSkill}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">No skills added yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Start adding your skills to track your progress.
            </p>
          </div>
        )}

        {roleOptions.length > 0 ? (
          <SkillGapAnalysis
            selectedRole={selectedRole}
            onChangeRole={setSelectedRole}
            roles={roleOptions}
            missingSkills={missingSkills}
            userSkills={skills}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            No career roles available. Ask the admin to create roles first.
          </div>
        )}
      </div>
    </div>
  );
}