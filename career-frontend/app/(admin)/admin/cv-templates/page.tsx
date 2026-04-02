"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import TemplateCard from "@/components/admin/templates/TemplateCard";
import { apiFetch } from "@/lib/api";
import type { AdminTemplate } from "@/types/admin";

type BackendTemplate = {
  _id: string;
  name: string;
  isActive: boolean;
  previewImageUrl?: string;
  layoutConfig?: Record<string, unknown>;
  htmlTemplate?: string;
};

function mapBackendTemplateToUi(template: BackendTemplate): AdminTemplate {
  return {
    id: template._id,
    name: template.name,
    description: `Manage availability for the ${template.name} template.`,
    status: template.isActive ? "active" : "inactive",
  };
}

export default function AdminCVTemplatesPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/cv-templates");
      const mappedTemplates = ((res.data || []) as BackendTemplate[]).map(
        mapBackendTemplateToUi
      );
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error("Failed to load CV templates:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load CV templates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const target = templates.find((template) => template.id === id);

    if (!target) return;

    try {
      await apiFetch(`/admin/cv-templates/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          isActive: target.status !== "active",
        }),
      });

      setTemplates((prev) =>
        prev.map((template) =>
          template.id === id
            ? {
                ...template,
                status: template.status === "active" ? "inactive" : "active",
              }
            : template
        )
      );
    } catch (error) {
      console.error("Failed to update template status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update template status"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="CV Templates"
        subtitle="Manage available CV templates for students."
      />

      {loading ? null : templates.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No templates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}