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

function mapBackendRoleToUi(role: BackendCareerRole): AdminCareerRole {
  return {
    id: role._id,
    title: role.title || "Untitled Role",
    description: role.description || "",
    keywords: [],
    requiredSkills: [],
  };
}

export default function AdminCareerRolesPage() {
  const [roles, setRoles] = useState<AdminCareerRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminCareerRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/careers");
      const mappedRoles = ((res.data || []) as BackendCareerRole[]).map(
        mapBackendRoleToUi
      );
      setRoles(mappedRoles);
    } catch (error) {
      console.error("Failed to load career roles:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load career roles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const sortedRoles = useMemo(() => {
    return [...roles].sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
  }, [roles]);

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
      const payload = {
        title: roleData.title,
        description: roleData.description,
      };

      if (editingRole) {
        await apiFetch(`/admin/careers/${roleData.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/admin/careers", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await loadRoles();
      setShowForm(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Failed to save career role:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save career role"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/admin/careers/${id}`, {
        method: "DELETE",
      });

      setRoles((prev) => prev.filter((role) => role.id !== id));
    } catch (error) {
      console.error("Failed to delete career role:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete career role"
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
        title="Career Roles"
        subtitle="Manage career roles and their required skills."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            + Add Role
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
          No career roles found.
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