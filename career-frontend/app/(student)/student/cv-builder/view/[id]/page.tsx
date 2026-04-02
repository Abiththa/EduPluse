"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import ClassicCVPreview from "@/components/cv/classic/ClassicCVPreview";
import { apiFetch } from "@/lib/api";
import type { CVState } from "@/types/cv-builder";

type BackendCv = {
  _id: string;
  templateId?:
    | string
    | {
        _id: string;
        name?: string;
      };
  data?: {
    personal?: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
    summary?: string;
    education?: Array<{
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>;
    experience?: Array<{
      company?: string;
      jobTitle?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>;
    projects?: Array<{
      title?: string;
      link?: string;
      description?: string;
      technologies?: string[];
    }>;
    skills?: string[];
    links?: Array<{
      label?: string;
      url?: string;
    }>;
  };
  status: string;
  updatedAt: string;
};

type StoredCV = CVState & {
  id: string;
  template: string;
  status: string;
  updatedAt: string;
};

function slugifyTemplateName(template?: string) {
  if (!template) return "classic";
  return template.trim().toLowerCase().replace(/\s+/g, "-");
}

function mapBackendCvToPreview(cv: BackendCv): StoredCV {
  const personal = cv.data?.personal || {};
  const templateName =
    typeof cv.templateId === "object" && cv.templateId?.name
      ? cv.templateId.name
      : "Classic";

  return {
    id: cv._id,
    template: slugifyTemplateName(templateName),
    status: cv.status === "final" ? "completed" : cv.status,
    updatedAt: cv.updatedAt,

    fullName: personal.fullName || "",
    email: personal.email || "",
    phone: personal.phone || "",
    location: personal.location || "",
    linkedIn: personal.linkedin || "",
    github: personal.github || "",
    summary: cv.data?.summary || "",

    education: (cv.data?.education || []).map((item, index) => ({
      id: `edu-${index}-${crypto.randomUUID()}`,
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.fieldOfStudy || "",
      start: item.startDate || "",
      end: item.endDate || "",
    })),

    experience: (cv.data?.experience || []).map((item, index) => ({
      id: `exp-${index}-${crypto.randomUUID()}`,
      company: item.company || "",
      position: item.jobTitle || "",
      start: item.startDate || "",
      end: item.endDate || "",
      description: item.description || "",
    })),

    projects: (cv.data?.projects || []).map((item, index) => ({
      id: `proj-${index}-${crypto.randomUUID()}`,
      name: item.title || "",
      link: item.link || "",
      description: item.description || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : "",
    })),

    skills: cv.data?.skills || [],
    skillInput: "",
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function CVPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [cvData, setCvData] = useState<StoredCV | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCv = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/cv/${id}`);
        const mappedCv = mapBackendCvToPreview(res.data as BackendCv);
        setCvData(mappedCv);
      } catch (error) {
        console.error("Failed to load CV:", error);
        alert(error instanceof Error ? error.message : "CV not found");
        router.push("/student/cv-builder");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCv();
    }
  }, [id, router]);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch(`${API_BASE_URL}/cv/${id}/download`);

      if (!response.ok) {
        let errorMessage = "Failed to download PDF";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // ignore json parse failure for non-json response
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const safeName = (cvData?.fullName || "cv")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();

      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName || "cv"}-${cvData?.template || "template"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return null;
  if (!cvData) return null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/student/cv-builder"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-200"
          >
            <ArrowLeft size={22} />
          </Link>

          <h1 className="text-4xl font-bold text-slate-900">CV Preview</h1>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={18} />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <ClassicCVPreview cvData={cvData} template={cvData.template} />
      </div>
    </div>
  );
}