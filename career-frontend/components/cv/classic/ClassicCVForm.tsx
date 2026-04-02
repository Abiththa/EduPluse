"use client";

import type {
  CVState,
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "@/types/cv-builder";
import type { CVErrors } from "@/app/(student)/student/cv-builder/create/[template]/page";

type ClassicCVFormProps = {
  cvData: CVState;
  setCvData: React.Dispatch<React.SetStateAction<CVState>>;
  onSaveDraft: () => void;
  onSaveComplete: () => void;
  errors?: CVErrors;
  setErrors: React.Dispatch<React.SetStateAction<CVErrors>>;
  isSavingDraft?: boolean;
  isSavingComplete?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const linkedInRegex =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9\-_%/]+\/?$/i;
const githubRegex =
  /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/i;
const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
const fullNameRegex = /^[A-Za-z\s]+$/;

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function isValidMonth(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

export default function ClassicCVForm({
  cvData,
  setCvData,
  onSaveDraft,
  onSaveComplete,
  errors,
  setErrors,
  isSavingDraft,
  isSavingComplete,
}: ClassicCVFormProps) {
  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border px-4 py-3 outline-none focus:border-sky-500 ${
      hasError ? "border-red-500" : "border-slate-300"
    }`;

  const textareaClass = (hasError?: boolean) =>
    `w-full rounded-xl border px-4 py-3 outline-none focus:border-sky-500 ${
      hasError ? "border-red-500" : "border-slate-300"
    }`;

  const updateField = (
    field: Exclude<keyof CVState, "education" | "experience" | "projects" | "skills">,
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };

      if (field === "fullName") {
        if (!value.trim()) {
          next.fullName = "Full name is required";
        } else if (value.trim().length < 3) {
          next.fullName = "Full name must be at least 3 characters";
        } else if (!fullNameRegex.test(value.trim())) {
          next.fullName = "Full name is invalid";
        } else {
          delete next.fullName;
        }
      }

      if (field === "email") {
        if (!value.trim()) {
          next.email = "Email is required";
        } else if (!emailRegex.test(value.trim())) {
          next.email = "Enter a valid email address";
        } else {
          delete next.email;
        }
      }

      if (field === "phone") {
        const digits = getPhoneDigits(value);
        if (!value.trim()) {
          next.phone = "Phone number is required";
        } else if (digits.length !== 10) {
          next.phone = "Phone number must contain 10 digits";
        } else {
          delete next.phone;
        }
      }

      if (field === "location") {
        if (!value.trim()) {
          next.location = "Location is required";
        } else {
          delete next.location;
        }
      }

      if (field === "linkedIn") {
        if (value.trim() && !linkedInRegex.test(value.trim())) {
          next.linkedIn = "Enter a valid LinkedIn URL";
        } else {
          delete next.linkedIn;
        }
      }

      if (field === "github") {
        if (value.trim() && !githubRegex.test(value.trim())) {
          next.github = "Enter a valid GitHub URL";
        } else {
          delete next.github;
        }
      }

      if (field === "summary") {
        if (!value.trim()) {
          next.summary = "Professional summary is required";
        } else if (value.trim().length < 10) {
          next.summary = "Professional summary should be at least 10 characters";
        } else {
          delete next.summary;
        }
      }

      if (field === "skillInput" && value.trim()) {
        delete next.skills;
      }

      return next;
    });
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      start: "",
      end: "",
    };

    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newItem],
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof EducationItem,
    value: string
  ) => {
    setCvData((prev) => {
      const updatedEducation = prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );

      const educationErrors: string[] = [];

      updatedEducation.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        education: educationErrors.some(Boolean) ? educationErrors : undefined,
      }));

      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => {
      const updatedEducation =
        prev.education.length === 1
          ? prev.education
          : prev.education.filter((item) => item.id !== id);

      const educationErrors: string[] = [];

      updatedEducation.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        education: educationErrors.some(Boolean) ? educationErrors : undefined,
      }));

      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      start: "",
      end: "",
      description: "",
    };

    setCvData((prev) => ({
      ...prev,
      experience: [...prev.experience, newItem],
    }));
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setCvData((prev) => {
      const updatedExperience = prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );

      const experienceErrors: string[] = [];

      updatedExperience.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        experience: experienceErrors.some(Boolean) ? experienceErrors : undefined,
      }));

      return {
        ...prev,
        experience: updatedExperience,
      };
    });
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => {
      const updatedExperience =
        prev.experience.length === 1
          ? prev.experience
          : prev.experience.filter((item) => item.id !== id);

      const experienceErrors: string[] = [];

      updatedExperience.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        experience: experienceErrors.some(Boolean) ? experienceErrors : undefined,
      }));

      return {
        ...prev,
        experience: updatedExperience,
      };
    });
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      description: "",
      technologies: "",
    };

    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, newItem],
    }));
  };

  const updateProject = (
    id: string,
    field: keyof ProjectItem,
    value: string
  ) => {
    setCvData((prev) => {
      const updatedProjects = prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );

      const projectErrors: string[] = [];

      updatedProjects.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        projects: projectErrors.some(Boolean) ? projectErrors : undefined,
      }));

      return {
        ...prev,
        projects: updatedProjects,
      };
    });
  };

  const removeProject = (id: string) => {
    setCvData((prev) => {
      const updatedProjects =
        prev.projects.length === 1
          ? prev.projects
          : prev.projects.filter((item) => item.id !== id);

      const projectErrors: string[] = [];

      updatedProjects.forEach((item, index) => {
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        projects: projectErrors.some(Boolean) ? projectErrors : undefined,
      }));

      return {
        ...prev,
        projects: updatedProjects,
      };
    });
  };

  const addSkill = () => {
    const trimmed = cvData.skillInput.trim();
    if (!trimmed) return;
    if (cvData.skills.includes(trimmed)) return;

    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
      skillInput: "",
    }));

    setErrors((prev) => ({
      ...prev,
      skills: undefined,
    }));
  };

  const removeSkill = (index: number) => {
    setCvData((prev) => {
      const updatedSkills = prev.skills.filter((_, i) => i !== index);

      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: updatedSkills.length === 0 ? "Add at least one skill" : undefined,
      }));

      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              value={cvData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={inputClass(!!errors?.fullName)}
            />
            {errors?.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              value={cvData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass(!!errors?.email)}
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              value={cvData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass(!!errors?.phone)}
            />
            {errors?.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              value={cvData.location}
              onChange={(e) => updateField("location", e.target.value)}
              className={inputClass(!!errors?.location)}
            />
            {errors?.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              LinkedIn
            </label>
            <input
              value={cvData.linkedIn}
              onChange={(e) => updateField("linkedIn", e.target.value)}
              className={inputClass(!!errors?.linkedIn)}
            />
            {errors?.linkedIn && (
              <p className="mt-1 text-sm text-red-500">{errors.linkedIn}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              GitHub
            </label>
            <input
              value={cvData.github}
              onChange={(e) => updateField("github", e.target.value)}
              className={inputClass(!!errors?.github)}
            />
            {errors?.github && (
              <p className="mt-1 text-sm text-red-500">{errors.github}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-semibold text-slate-900">
          Professional Summary
        </h2>
        <textarea
          rows={5}
          value={cvData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="Brief summary of your experience and goals..."
          className={textareaClass(!!errors?.summary)}
        />
        {errors?.summary && (
          <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Education</h2>
          <button
            type="button"
            onClick={addEducation}
            className="text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {cvData.education.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeEducation(item.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {errors?.education?.[index] && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.education[index]}
                </p>
              )}

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Institution
                </label>
                <input
                  value={item.institution}
                  onChange={(e) =>
                    updateEducation(item.id, "institution", e.target.value)
                  }
                  className={inputClass(!!errors?.education?.[index])}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Degree
                  </label>
                  <input
                    value={item.degree}
                    onChange={(e) =>
                      updateEducation(item.id, "degree", e.target.value)
                    }
                    className={inputClass(!!errors?.education?.[index])}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Field
                  </label>
                  <input
                    value={item.field}
                    onChange={(e) =>
                      updateEducation(item.id, "field", e.target.value)
                    }
                    className={inputClass(!!errors?.education?.[index])}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start
                  </label>
                  <input
                    type="month"
                    value={item.start}
                    onChange={(e) =>
                      updateEducation(item.id, "start", e.target.value)
                    }
                    className={inputClass(!!errors?.education?.[index])}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End
                  </label>
                  <input
                    type="month"
                    value={item.end}
                    onChange={(e) =>
                      updateEducation(item.id, "end", e.target.value)
                    }
                    className={inputClass(!!errors?.education?.[index])}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Experience</h2>
          <button
            type="button"
            onClick={addExperience}
            className="text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {cvData.experience.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeExperience(item.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {errors?.experience?.[index] && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.experience[index]}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Company
                  </label>
                  <input
                    value={item.company}
                    onChange={(e) =>
                      updateExperience(item.id, "company", e.target.value)
                    }
                    className={inputClass(!!errors?.experience?.[index])}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Position
                  </label>
                  <input
                    value={item.position}
                    onChange={(e) =>
                      updateExperience(item.id, "position", e.target.value)
                    }
                    className={inputClass(!!errors?.experience?.[index])}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start
                  </label>
                  <input
                    type="month"
                    value={item.start}
                    onChange={(e) =>
                      updateExperience(item.id, "start", e.target.value)
                    }
                    className={inputClass(!!errors?.experience?.[index])}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End
                  </label>
                  <input
                    type="month"
                    value={item.end}
                    onChange={(e) =>
                      updateExperience(item.id, "end", e.target.value)
                    }
                    className={inputClass(!!errors?.experience?.[index])}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={item.description}
                  onChange={(e) =>
                    updateExperience(item.id, "description", e.target.value)
                  }
                  className={textareaClass(!!errors?.experience?.[index])}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
          <button
            type="button"
            onClick={addProject}
            className="text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {cvData.projects.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeProject(item.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {errors?.projects?.[index] && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.projects[index]}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    value={item.name}
                    onChange={(e) =>
                      updateProject(item.id, "name", e.target.value)
                    }
                    className={inputClass(!!errors?.projects?.[index])}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Link
                  </label>
                  <input
                    value={item.link}
                    onChange={(e) =>
                      updateProject(item.id, "link", e.target.value)
                    }
                    className={inputClass(!!errors?.projects?.[index])}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={item.description}
                  onChange={(e) =>
                    updateProject(item.id, "description", e.target.value)
                  }
                  className={textareaClass(!!errors?.projects?.[index])}
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Technologies
                </label>
                <input
                  value={item.technologies}
                  onChange={(e) =>
                    updateProject(item.id, "technologies", e.target.value)
                  }
                  placeholder="React, Next.js, Tailwind CSS"
                  className={inputClass(!!errors?.projects?.[index])}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-semibold text-slate-900">Skills</h2>

        <div className="flex gap-3">
          <input
            value={cvData.skillInput}
            onChange={(e) => updateField("skillInput", e.target.value)}
            placeholder="Add a skill..."
            className={`flex-1 rounded-xl border px-4 py-3 outline-none focus:border-sky-500 ${
              errors?.skills ? "border-red-500" : "border-slate-300"
            }`}
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
          >
            Add
          </button>
        </div>

        {errors?.skills && (
          <p className="mt-2 text-sm text-red-500">{errors.skills}</p>
        )}

        {cvData.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <button
                key={`${skill}-${index}`}
                type="button"
                onClick={() => removeSkill(index)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
              >
                {skill} ×
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-4 pb-8">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSavingDraft}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingDraft ? "Saving..." : "Save as Draft"}
        </button>

        <button
          type="button"
          onClick={onSaveComplete}
          disabled={isSavingComplete}
          className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingComplete ? "Saving..." : "Save & Complete"}
        </button>
      </div>
    </div>
  );
}