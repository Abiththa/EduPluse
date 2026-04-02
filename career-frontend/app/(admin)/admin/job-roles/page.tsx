"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import RoleCard from "@/components/admin/roles/RoleCard";
import RoleForm from "@/components/admin/roles/RoleForm";
import { apiFetch } from "@/lib/api";
import type { AdminCareerRole } from "@/types/admin";

type BackendCareerRole = {
  _id: string;
  title: string;
  description?: string;
};

type BackendJobRole = {
  _id: string;
  title: string;
  linkedCareerRoleId?:
    | string
    | {
        _id: string;
        title?: string;
        description?: string;
      }
    | null;
  requiredSkills?: Array<{
    name: string;
    minLevel: "beginner" | "intermediate" | "advanced";
  }>;
  keywords?: string[];
};

function mapBackendJobRoleToUi(jobRole: BackendJobRole): AdminCareerRole {
  const linkedCareerTitle =
    typeof jobRole.linkedCareerRoleId === "object" &&
    jobRole.linkedCareerRoleId?.title
      ? jobRole.linkedCareerRoleId.title
      : "";

  return {
    id: jobRole._id,
    title: jobRole.title || "Untitled Job Role",
    description: linkedCareerTitle
      ? `Linked Career Role: ${linkedCareerTitle}`
      : "No linked career role",
    keywords: Array.isArray(jobRole.keywords) ? jobRole.keywords : [],
    requiredSkills: Array.isArray(jobRole.requiredSkills)
      ? jobRole.requiredSkills.map((skill) => ({
          name: skill.name,
          level: skill.minLevel,
        }))
      : [],
  };
}

export default function AdminJobRolesPage() {
  const [jobRoles, setJobRoles] = useState<AdminCareerRole[]>([]);
  const [careerRoles, setCareerRoles] = useState<BackendCareerRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminCareerRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [jobRolesRes, careersRes] = await Promise.all([
        apiFetch("/admin/job-roles"),
        apiFetch("/admin/careers"),
      ]);

      const mappedJobRoles = ((jobRolesRes.data || []) as BackendJobRole[]).map(
        mapBackendJobRoleToUi
      );

      setJobRoles(mappedJobRoles);
      setCareerRoles((careersRes.data || []) as BackendCareerRole[]);
    } catch (error) {
      console.error("Failed to load job roles:", error);
      alert(
        error instanceof Error ? error.message : "Failed to load job roles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedRoles = useMemo(() => {
    return [...jobRoles].sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
  }, [jobRoles]);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  const handleOpenEdit = (role: AdminCareerRole) => {
    setEditingRole(role);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (roleData: AdminCareerRole) => {
    try {
      const matchingCareer = careerRoles.find(
        (career) =>
          career.title.trim().toLowerCase() ===
          roleData.title.trim().toLowerCase()
      );

      const payload = {
        title: roleData.title,
        linkedCareerRoleId: matchingCareer?._id || null,
        requiredSkills: roleData.requiredSkills.map((skill) => ({
          name: skill.name,
          minLevel: skill.level,
        })),
        keywords: roleData.keywords,
      };

      if (editingRole) {
        await apiFetch(`/admin/job-roles/${roleData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/admin/job-roles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await loadData();
      setShowForm(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Failed to save job role:", error);
      alert(error instanceof Error ? error.message : "Failed to save job role");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/admin/job-roles/${id}`, {
        method: "DELETE",
      });

      setJobRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (error) {
      console.error("Failed to delete job role:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete job role"
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  return (
    <div>
      <PageHeader
        title="Job Roles"
        subtitle="Manage job roles used for student job suggestions."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            + Add Job Role
          </button>
        }
      />

      {showForm ? (
        <RoleForm
          mode={editingRole ? "edit" : "add"}
          initialRole={editingRole}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : null}

      {loading ? null : sortedRoles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No job roles found.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}