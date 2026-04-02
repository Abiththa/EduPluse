"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import PrimaryButton from "@/components/common/PrimaryButton";
import EmptyState from "@/components/common/EmptyState";
import SavedCVCard from "@/components/cv/SavedCVCard";
import { apiFetch } from "@/lib/api";

type BackendCv = {
  _id: string;
  userId: string;
  templateId?:
    | string
    | {
        _id: string;
        name?: string;
      };
  data?: {
    personal?: {
      fullName?: string;
    };
  };
  updatedAt: string;
  status: string;
};

type SavedCV = {
  id: string;
  template?: string;
  fullName: string;
  updatedAt: string;
  status: string;
};

function mapBackendCv(cv: BackendCv): SavedCV {
  const templateName =
    typeof cv.templateId === "object" && cv.templateId?.name
      ? cv.templateId.name
      : "Classic";

  return {
    id: cv._id,
    template: templateName,
    fullName: cv.data?.personal?.fullName || "Untitled CV",
    updatedAt: cv.updatedAt,
    status: cv.status === "final" ? "completed" : cv.status,
  };
}

export default function CVBuilderPage() {
  const [cvList, setCvList] = useState<SavedCV[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCvs = async () => {
    try {
      const res = await apiFetch("/cv");
      const mapped = ((res.data || []) as BackendCv[]).map(mapBackendCv);
      setCvList(mapped);
    } catch (error) {
      console.error("Failed to load CVs:", error);
      alert(error instanceof Error ? error.message : "Failed to load CVs");
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadCvs();
  }, []);

  const deleteCV = async (id: string) => {
    try {
      await apiFetch(`/cv/${id}`, {
        method: "DELETE",
      });

      setCvList((prev) => prev.filter((cv) => cv.id !== id));
    } catch (error) {
      console.error("Failed to delete CV:", error);
      alert(error instanceof Error ? error.message : "Failed to delete CV");
    }
  };

  return (
    <div>
      <PageHeader
        title="CV Builder"
        subtitle="Create, manage, and download your CVs."
        action={
          <PrimaryButton href="/student/cv-builder/templates" icon>
            New CV
          </PrimaryButton>
        }
      />

      {!isLoaded ? null : cvList.length === 0 ? (
        <EmptyState
          title="No CVs yet"
          description="Create your first CV to get started."
          button={
            <PrimaryButton href="/student/cv-builder/templates" icon>
              Create CV
            </PrimaryButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cvList.map((cv) => (
            <SavedCVCard
              key={cv.id}
              id={cv.id}
              fullName={cv.fullName}
              template={cv.template}
              updatedAt={cv.updatedAt}
              status={cv.status}
              onDelete={deleteCV}
            />
          ))}
        </div>
      )}
    </div>
  );
}