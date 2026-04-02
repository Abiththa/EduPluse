"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import JobCard from "@/components/jobs/JobCard";
import { apiFetch } from "@/lib/api";

type BackendJobSuggestion = {
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
    minLevel: string;
  }>;
  keywords?: string[];
  matchPercentage: number;
  matchedSkills?: Array<{
    name: string;
    userLevel?: string;
    requiredLevel?: string;
  }>;
  missingSkills?: Array<{
    name: string;
    requiredLevel?: string;
    reason?: string;
  }>;
};

type JobCardItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  match: number;
  description: string;
  missingSkills: string[];
};

function mapBackendJob(job: BackendJobSuggestion): JobCardItem {
  const relatedCareer =
    typeof job.linkedCareerRoleId === "object" && job.linkedCareerRoleId?.title
      ? job.linkedCareerRoleId.title
      : "Recommended Role";

  const description =
    typeof job.linkedCareerRoleId === "object" &&
    job.linkedCareerRoleId?.description
      ? job.linkedCareerRoleId.description
      : `This role matches your current saved skills and highlights areas you can improve for ${job.title}.`;

  return {
    id: job._id,
    title: job.title,
    company: relatedCareer,
    location: "Based on your profile",
    match: job.matchPercentage || 0,
    description,
    missingSkills: (job.missingSkills || []).map((skill) => skill.name),
  };
}

export default function JobSuggestionsPage() {
  const [jobs, setJobs] = useState<JobCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [targetCareer, setTargetCareer] = useState("");

  const uniqueCareerTitles = useMemo(() => {
    return Array.from(new Set(jobs.map((job) => job.company))).filter(Boolean);
  }, [jobs]);

  const loadJobs = async (careerFilter = "") => {
    try {
      setLoading(true);
      setError("");

      const query = careerFilter
        ? `/jobs/suggestions?targetCareer=${encodeURIComponent(careerFilter)}`
        : "/jobs/suggestions";

      const res = await apiFetch(query);
      const mappedJobs = ((res.data || []) as BackendJobSuggestion[]).map(
        mapBackendJob
      );

      setJobs(mappedJobs);
    } catch (err) {
      console.error("Failed to load job suggestions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load job suggestions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleFilterChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setTargetCareer(value);
    await loadJobs(value);
  };

  return (
    <div>
      <PageHeader
        title="Job Suggestions"
        subtitle="Explore jobs that match your current profile and skill set."
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Filter by target career
          </label>

          <select
            value={targetCareer}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
          >
            <option value="">All suggested roles</option>
            {uniqueCareerTitles.map((career) => (
              <option key={career} value={career}>
                {career}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">
              Loading job suggestions...
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch the best matches for you.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-red-700">
              Failed to load job suggestions
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">
              No job suggestions available
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Add more skills to your profile or ask the admin to create job roles.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              match={job.match}
              description={job.description}
              missingSkills={job.missingSkills}
            />
          ))
        )}
      </div>
    </div>
  );
}