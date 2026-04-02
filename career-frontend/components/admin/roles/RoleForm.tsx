"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminCareerRole, AdminSkillLevel } from "@/types/admin";

type RoleFormProps = {
  mode: "add" | "edit";
  initialRole: AdminCareerRole | null;
  onSave: (role: AdminCareerRole) => void;
  onCancel: () => void;
};

export default function RoleForm({
  mode,
  initialRole,
  onSave,
  onCancel,
}: RoleFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");

  useEffect(() => {
    if (initialRole) {
      setTitle(initialRole.title);
      setDescription(initialRole.description);
      setKeywords(initialRole.keywords.join(", "));
      setRequiredSkills(
        initialRole.requiredSkills
          .map((skill) => `${skill.name}:${skill.level}`)
          .join(", ")
      );
    } else {
      setTitle("");
      setDescription("");
      setKeywords("");
      setRequiredSkills("");
    }
  }, [initialRole]);

  const parseSkillLevel = (value: string): AdminSkillLevel => {
    const normalized = value.trim().toLowerCase();

    if (normalized === "advanced") return "advanced";
    if (normalized === "intermediate") return "intermediate";
    return "beginner";
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a role title");
      return;
    }

    const parsedKeywords = keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const parsedSkills = requiredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, level] = item.split(":").map((v) => v.trim());

        return {
          name: name || "",
          level: parseSkillLevel(level || "beginner"),
        };
      })
      .filter((item) => item.name);

    onSave({
      id: initialRole?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      keywords: parsedKeywords,
      requiredSkills: parsedSkills,
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-slate-900">
          {mode === "edit" ? "Edit Role" : "Add Role"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title
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
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="React, Node.js, TypeScript"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Required Skills (name:level, comma-separated)
          </label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="JavaScript:advanced, React:intermediate"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
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