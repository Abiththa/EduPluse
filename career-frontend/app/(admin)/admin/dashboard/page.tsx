"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Briefcase,
  Map,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { apiFetch } from "@/lib/api";

type BackendTemplate = {
  _id: string;
  name: string;
  isActive: boolean;
};

type BackendCareerRole = {
  _id: string;
  title: string;
};

type BackendRoadmap = {
  _id: string;
};

export default function AdminDashboardPage() {
  const [templates, setTemplates] = useState<BackendTemplate[]>([]);
  const [roles, setRoles] = useState<BackendCareerRole[]>([]);
  const [roadmaps, setRoadmaps] = useState<BackendRoadmap[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoaded(false);

        const [templatesRes, rolesRes, roadmapsRes] = await Promise.all([
          apiFetch("/admin/cv-templates"),
          apiFetch("/admin/careers"),
          apiFetch("/admin/roadmaps"),
        ]);

        setTemplates((templatesRes.data || []) as BackendTemplate[]);
        setRoles((rolesRes.data || []) as BackendCareerRole[]);
        setRoadmaps((roadmapsRes.data || []) as BackendRoadmap[]);
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoaded(true);
      }
    };

    loadAdminData();
  }, []);

  const stats = useMemo(() => {
    const activeTemplates = templates.filter(
      (template) => template.isActive
    ).length;

    return [
      {
        title: "CV Templates",
        value: String(templates.length),
        icon: <FileText size={20} className="text-sky-500" />,
      },
      {
        title: "Active Templates",
        value: String(activeTemplates),
        icon: <CheckCircle2 size={20} className="text-emerald-500" />,
      },
      {
        title: "Career Roles",
        value: String(roles.length),
        icon: <Briefcase size={20} className="text-emerald-500" />,
      },
      {
        title: "Roadmaps",
        value: String(roadmaps.length),
        icon: <Map size={20} className="text-amber-500" />,
      },
    ];
  }, [templates, roles, roadmaps]);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage career module configuration."
      />

      {!loaded ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            title="CV Templates"
            value="0"
            icon={<FileText size={20} className="text-sky-500" />}
          />
          <AdminStatCard
            title="Active Templates"
            value="0"
            icon={<CheckCircle2 size={20} className="text-emerald-500" />}
          />
          <AdminStatCard
            title="Career Roles"
            value="0"
            icon={<Briefcase size={20} className="text-emerald-500" />}
          />
          <AdminStatCard
            title="Roadmaps"
            value="0"
            icon={<Map size={20} className="text-amber-500" />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <AdminStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}