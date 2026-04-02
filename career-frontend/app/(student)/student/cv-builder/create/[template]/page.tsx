"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ClassicCVForm from "@/components/cv/classic/ClassicCVForm";
import ClassicCVPreview from "@/components/cv/classic/ClassicCVPreview";
import { apiFetch } from "@/lib/api";
import type { CVState } from "@/types/cv-builder";

function formatTemplateName(template?: string) {
  if (!template) return "Classic";
  return template.charAt(0).toUpperCase() + template.slice(1);
}

export type CVErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  education?: string[];
  experience?: string[];
  projects?: string[];
  skills?: string;
};

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
  };
  status: string;
  updatedAt: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkedInRegex =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9\-_%/]+\/?$/i;
const githubRegex =
  /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/i;
const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;

function isValidMonth(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function validateDraft(cvData: CVState): CVErrors {
  const errors: CVErrors = {};

  if (!cvData.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!cvData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(cvData.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  const phoneDigits = getPhoneDigits(cvData.phone);
  if (!cvData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (phoneDigits.length !== 10) {
    errors.phone = "Phone number must contain 10 digits";
  }

  if (!cvData.location.trim()) {
    errors.location = "Location is required";
  }

  if (cvData.linkedIn.trim() && !linkedInRegex.test(cvData.linkedIn.trim())) {
    errors.linkedIn = "Enter a valid LinkedIn URL";
  }

  if (cvData.github.trim() && !githubRegex.test(cvData.github.trim())) {
    errors.github = "Enter a valid GitHub URL";
  }

  return errors;
}

function validateComplete(cvData: CVState): CVErrors {
  const errors: CVErrors = validateDraft(cvData);

  if (!cvData.summary.trim()) {
    errors.summary = "Professional summary is required";
  } else if (cvData.summary.trim().length < 10) {
    errors.summary = "Professional summary should be at least 10 characters";
  }

  const educationErrors: string[] = [];
  cvData.education.forEach((item, index) => {
    const rowErrors: string[] = [];

    if (!item.institution.trim()) rowErrors.push("Institution is required");
    if (!item.degree.trim()) rowErrors.push("Degree is required");
    if (!item.field.trim()) rowErrors.push("Field is required");
    if (!item.start.trim()) rowErrors.push("Start date is required");
    if (!item.end.trim()) rowErrors.push("End date is required");

    if (item.start && !isValidMonth(item.start)) {
      rowErrors.push("Start date is invalid");
    }

    if (item.end && !isValidMonth(item.end)) {
      rowErrors.push("End date is invalid");
    }

    if (item.start && item.end && item.start > item.end) {
      rowErrors.push("End date must be after start date");
    }

    if (rowErrors.length > 0) {
      educationErrors[index] = rowErrors.join(", ");
    }
  });

  if (educationErrors.some(Boolean)) {
    errors.education = educationErrors;
  }

  const experienceErrors: string[] = [];
  cvData.experience.forEach((item, index) => {
    const hasAnyValue =
      item.company.trim() ||
      item.position.trim() ||
      item.start.trim() ||
      item.end.trim() ||
      item.description.trim();

    if (!hasAnyValue) return;

    const rowErrors: string[] = [];

    if (!item.company.trim()) rowErrors.push("Company is required");
    if (!item.position.trim()) rowErrors.push("Position is required");
    if (!item.start.trim()) rowErrors.push("Start date is required");
    if (!item.end.trim()) rowErrors.push("End date is required");
    if (!item.description.trim()) rowErrors.push("Description is required");

    if (item.start && !isValidMonth(item.start)) {
      rowErrors.push("Start date is invalid");
    }

    if (item.end && !isValidMonth(item.end)) {
      rowErrors.push("End date is invalid");
    }

    if (item.start && item.end && item.start > item.end) {
      rowErrors.push("End date must be after start date");
    }

    if (rowErrors.length > 0) {
      experienceErrors[index] = rowErrors.join(", ");
    }
  });

  if (experienceErrors.some(Boolean)) {
    errors.experience = experienceErrors;
  }

  const projectErrors: string[] = [];
  cvData.projects.forEach((item, index) => {
    const hasAnyValue =
      item.name.trim() ||
      item.link.trim() ||
      item.description.trim() ||
      item.technologies.trim();

    if (!hasAnyValue) return;

    const rowErrors: string[] = [];

    if (!item.name.trim()) rowErrors.push("Project name is required");
    if (!item.description.trim()) rowErrors.push("Description is required");
    if (!item.technologies.trim()) rowErrors.push("Technologies are required");

    if (item.link.trim() && !urlRegex.test(item.link.trim())) {
      rowErrors.push("Project link is invalid");
    }

    if (rowErrors.length > 0) {
      projectErrors[index] = rowErrors.join(", ");
    }
  });

  if (projectErrors.some(Boolean)) {
    errors.projects = projectErrors;
  }

  if (cvData.skills.length === 0) {
    errors.skills = "Add at least one skill";
  }

  return errors;
}

function hasErrors(errors: CVErrors) {
  return Object.values(errors).some((value) => {
    if (Array.isArray(value)) {
      return value.some(Boolean);
    }
    return Boolean(value);
  });
}

function createEmptyCvState(): CVState {
  return {
    fullName: "Amal Perera",
    email: "amal@edupulse.lk",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    linkedIn: "",
    github: "",
    summary: "",
    education: [
      {
        id: crypto.randomUUID(),
        institution: "University of Colombo",
        degree: "BSc",
        field: "Computer Science",
        start: "2021-09",
        end: "2025-06",
      },
    ],
    experience: [
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        start: "",
        end: "",
        description: "",
      },
    ],
    projects: [
      {
        id: crypto.randomUUID(),
        name: "",
        link: "",
        description: "",
        technologies: "",
      },
    ],
    skills: [],
    skillInput: "",
  };
}

function mapBackendCvToFormState(cv: BackendCv): CVState {
  const personal = cv.data?.personal || {};

  return {
    fullName: personal.fullName || "",
    email: personal.email || "",
    phone: personal.phone || "",
    location: personal.location || "",
    linkedIn: personal.linkedin || "",
    github: personal.github || "",
    summary: cv.data?.summary || "",
    education:
      (cv.data?.education || []).length > 0
        ? (cv.data?.education || []).map((item) => ({
            id: crypto.randomUUID(),
            institution: item.institution || "",
            degree: item.degree || "",
            field: item.fieldOfStudy || "",
            start: item.startDate || "",
            end: item.endDate || "",
          }))
        : [
            {
              id: crypto.randomUUID(),
              institution: "",
              degree: "",
              field: "",
              start: "",
              end: "",
            },
          ],
    experience:
      (cv.data?.experience || []).length > 0
        ? (cv.data?.experience || []).map((item) => ({
            id: crypto.randomUUID(),
            company: item.company || "",
            position: item.jobTitle || "",
            start: item.startDate || "",
            end: item.endDate || "",
            description: item.description || "",
          }))
        : [
            {
              id: crypto.randomUUID(),
              company: "",
              position: "",
              start: "",
              end: "",
              description: "",
            },
          ],
    projects:
      (cv.data?.projects || []).length > 0
        ? (cv.data?.projects || []).map((item) => ({
            id: crypto.randomUUID(),
            name: item.title || "",
            link: item.link || "",
            description: item.description || "",
            technologies: Array.isArray(item.technologies)
              ? item.technologies.join(", ")
              : "",
          }))
        : [
            {
              id: crypto.randomUUID(),
              name: "",
              link: "",
              description: "",
              technologies: "",
            },
          ],
    skills: cv.data?.skills || [],
    skillInput: "",
  };
}

function buildCvPayload(cvData: CVState, templateId: string, status: "draft" | "final") {
  return {
    templateId,
    status,
    data: {
      personal: {
        fullName: cvData.fullName.trim(),
        email: cvData.email.trim(),
        phone: cvData.phone.trim(),
        location: cvData.location.trim(),
        linkedin: cvData.linkedIn.trim(),
        github: cvData.github.trim(),
        portfolio: "",
      },
      summary: cvData.summary.trim(),
      education: cvData.education.map((item) => ({
        institution: item.institution.trim(),
        degree: item.degree.trim(),
        fieldOfStudy: item.field.trim(),
        startDate: item.start.trim(),
        endDate: item.end.trim(),
        description: "",
      })),
      experience: cvData.experience
        .filter(
          (item) =>
            item.company.trim() ||
            item.position.trim() ||
            item.start.trim() ||
            item.end.trim() ||
            item.description.trim()
        )
        .map((item) => ({
          company: item.company.trim(),
          jobTitle: item.position.trim(),
          startDate: item.start.trim(),
          endDate: item.end.trim(),
          description: item.description.trim(),
        })),
      projects: cvData.projects
        .filter(
          (item) =>
            item.name.trim() ||
            item.link.trim() ||
            item.description.trim() ||
            item.technologies.trim()
        )
        .map((item) => ({
          title: item.name.trim(),
          description: item.description.trim(),
          link: item.link.trim(),
          technologies: item.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
        })),
      skills: cvData.skills,
      links: [],
    },
  };
}

export default function CreateCVPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTemplate = params?.template;
  const template =
    typeof rawTemplate === "string"
      ? rawTemplate.toLowerCase().trim()
      : Array.isArray(rawTemplate)
      ? rawTemplate[0].toLowerCase().trim()
      : "classic";

  const editId = searchParams.get("id") || "";
  const templateIdFromQuery = searchParams.get("templateId") || "";
  const templateName = formatTemplateName(template);

  const [cvData, setCvData] = useState<CVState>(createEmptyCvState());
  const [resolvedTemplateId, setResolvedTemplateId] = useState(templateIdFromQuery);
  const [errors, setErrors] = useState<CVErrors>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSavingComplete, setIsSavingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(editId));

  useEffect(() => {
    const loadExistingCv = async () => {
      if (!editId) {
        setResolvedTemplateId(templateIdFromQuery);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await apiFetch(`/cv/${editId}`);
        const cv = res.data as BackendCv;

        setCvData(mapBackendCvToFormState(cv));

        if (typeof cv.templateId === "object" && cv.templateId?._id) {
          setResolvedTemplateId(cv.templateId._id);
        } else if (typeof cv.templateId === "string") {
          setResolvedTemplateId(cv.templateId);
        } else {
          setResolvedTemplateId(templateIdFromQuery);
        }
      } catch (error) {
        console.error("Failed to load CV for editing:", error);
        alert(error instanceof Error ? error.message : "Failed to load CV");
        router.push("/student/cv-builder");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingCv();
  }, [editId, templateIdFromQuery, router]);

  const saveDraft = async () => {
    const validationErrors = validateDraft(cvData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      alert("Please fix the form errors before saving draft");
      return;
    }

    if (!resolvedTemplateId) {
      alert("Template ID is missing. Please go back and select a template again.");
      return;
    }

    try {
      setIsSavingDraft(true);

      if (editId) {
        await apiFetch(`/cv/${editId}`, {
          method: "PUT",
          body: JSON.stringify(buildCvPayload(cvData, resolvedTemplateId, "draft")),
        });
      } else {
        await apiFetch("/cv", {
          method: "POST",
          body: JSON.stringify(buildCvPayload(cvData, resolvedTemplateId, "draft")),
        });
      }

      alert(editId ? "Draft updated successfully" : "Draft saved successfully");
      router.push("/student/cv-builder");
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const saveComplete = async () => {
    const validationErrors = validateComplete(cvData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      alert("Please fix the form errors before saving");
      return;
    }

    if (!resolvedTemplateId) {
      alert("Template ID is missing. Please go back and select a template again.");
      return;
    }

    try {
      setIsSavingComplete(true);

      if (editId) {
        await apiFetch(`/cv/${editId}`, {
          method: "PUT",
          body: JSON.stringify(buildCvPayload(cvData, resolvedTemplateId, "final")),
        });
      } else {
        await apiFetch("/cv", {
          method: "POST",
          body: JSON.stringify(buildCvPayload(cvData, resolvedTemplateId, "final")),
        });
      }

      alert(editId ? "CV updated successfully" : "CV saved successfully");
      router.push("/student/cv-builder");
    } catch (error) {
      console.error("Failed to save CV:", error);
      alert(error instanceof Error ? error.message : "Failed to save CV");
    } finally {
      setIsSavingComplete(false);
    }
  };

  if (isLoading) return null;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/student/cv-builder/templates"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            {editId ? "Edit CV" : "Create CV"} — {templateName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
          <ClassicCVForm
            cvData={cvData}
            setCvData={setCvData}
            onSaveDraft={saveDraft}
            onSaveComplete={saveComplete}
            errors={errors}
            setErrors={setErrors}
            isSavingDraft={isSavingDraft}
            isSavingComplete={isSavingComplete}
          />
        </div>

        <div className="xl:sticky xl:top-8 xl:self-start">
          <ClassicCVPreview cvData={cvData} template={template} />
        </div>
      </div>
    </div>
  );
}