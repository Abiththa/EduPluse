"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type BackendTemplate = {
  _id: string;
  name: string;
  isActive: boolean;
  previewImageUrl?: string;
  layoutConfig?: Record<string, unknown>;
  htmlTemplate?: string;
};

type TemplateCardItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

function getTemplateLetter(name: string) {
  return name.charAt(0).toUpperCase();
}

function getTemplatePreviewStyle(id: string) {
  switch (id) {
    case "classic":
      return "bg-slate-100 text-slate-700";
    case "modern":
      return "bg-cyan-50 text-cyan-600";
    case "minimal":
      return "bg-slate-50 text-slate-900";
    case "professional":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function slugifyTemplateName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function getTemplateDescription(name: string) {
  const normalized = name.trim().toLowerCase();

  switch (normalized) {
    case "classic":
      return "A clean and traditional CV design for a professional presentation.";
    case "modern":
      return "A stylish and contemporary layout with a fresh visual structure.";
    case "minimal":
      return "A simple and elegant design focused on clarity and readability.";
    case "professional":
      return "A polished template designed to highlight your strengths effectively.";
    default:
      return "A CV template ready for you to customize with your own details.";
  }
}

function mapBackendTemplate(template: BackendTemplate): TemplateCardItem {
  const slug = slugifyTemplateName(template.name);

  return {
    id: template._id,
    slug,
    name: template.name,
    description: getTemplateDescription(template.name),
  };
}

export default function CVTemplatePage() {
  const [templates, setTemplates] = useState<TemplateCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/cv/templates");
        const backendTemplates = (res.data || []) as BackendTemplate[];
        const mappedTemplates = backendTemplates
          .filter((template) => template.isActive)
          .map(mapBackendTemplate);

        setTemplates(mappedTemplates);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load templates"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/student/cv-builder"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Choose a Template
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Select a design for your CV.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-medium text-slate-700">
            Loading templates...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we load available CV templates.
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-medium text-red-700">
            Failed to load templates
          </p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-medium text-slate-700">
            No active templates available
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Ask the admin to activate at least one CV template.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/student/cv-builder/create/${template.slug}?templateId=${template.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-64 items-center justify-center rounded-xl text-5xl font-bold ${getTemplatePreviewStyle(
                  template.slug
                )}`}
              >
                {getTemplateLetter(template.name)}
              </div>

              <h3 className="text-2xl font-semibold text-slate-900">
                {template.name}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-slate-500">
                {template.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}