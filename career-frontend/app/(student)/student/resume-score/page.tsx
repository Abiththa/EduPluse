"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ResumeScoreForm from "@/components/resume-score/ResumeScoreForm";
import ResumeScoreResult from "@/components/resume-score/ResumeScoreResult";
import { apiFetch } from "@/lib/api";
import type {
  ResumeScoreAnalysis,
  SavedCVForScoring,
} from "@/types/resume-score";

type BackendCv = {
  _id: string;
  data?: {
    personal?: {
      fullName?: string;
    };
  };
  status: string;
  updatedAt: string;
};

type BackendJobRole = {
  _id: string;
  title: string;
};

type BackendResumeScore = {
  _id: string;
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  createdAt?: string;
  breakdown?: {
    completenessScore: number;
    projectStrengthScore: number;
    keywordScore: number;
  };
  cvId?: {
    _id: string;
    status?: string;
    updatedAt?: string;
  } | null;
  targetRoleId?: {
    _id: string;
    title: string;
    keywords?: string[];
  } | null;
};

type RoleOption = {
  id: string;
  title: string;
};

type ResumeScoreHistoryItem = {
  id: string;
  score: number;
  roleTitle: string;
  createdAt: string;
  missingKeywords: string[];
  result: ResumeScoreAnalysis;
};

function mapBackendCv(cv: BackendCv): SavedCVForScoring {
  return {
    id: cv._id,
    fullName: cv.data?.personal?.fullName || "Untitled CV",
    status: cv.status === "final" ? "completed" : cv.status,
    updatedAt: cv.updatedAt,
  };
}

function mapScoreResult(
  scoreData: BackendResumeScore,
  selectedRoleTitle: string
): ResumeScoreAnalysis {
  const finalScore = scoreData.score || 0;
  const keywordScore = scoreData.breakdown?.keywordScore || 0;
  const completenessScore = scoreData.breakdown?.completenessScore || 0;
  const projectStrengthScore = scoreData.breakdown?.projectStrengthScore || 0;

  return {
    score: finalScore,
    rating:
      finalScore >= 80
        ? "Excellent"
        : finalScore >= 60
        ? "Good"
        : finalScore >= 40
        ? "Average"
        : "Needs Improvement",
    matchedKeywords: [],
    missingKeywords: scoreData.missingKeywords || [],
    suggestions: scoreData.suggestions || [],
    sections: [
      {
        title: "Completeness",
        score: completenessScore,
        feedback:
          completenessScore >= 70
            ? "Your CV includes most key sections."
            : "Your CV is missing some important sections.",
      },
      {
        title: "Projects",
        score: projectStrengthScore,
        feedback:
          projectStrengthScore >= 15
            ? "Your project section is reasonably strong."
            : "Your project section needs more detail and stronger examples.",
      },
      {
        title: "Target Role Match",
        score: keywordScore,
        feedback:
          selectedRoleTitle === "No target role"
            ? "No target role selected."
            : keywordScore >= 60
            ? "Your CV aligns fairly well with the selected role."
            : "Your CV needs more target-role keywords and role-specific content.",
      },
    ],
  };
}

function formatDateTime(date?: string) {
  if (!date) return "Unknown date";
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResumeScorePage() {
  const [savedCVs, setSavedCVs] = useState<SavedCVForScoring[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [selectedCVId, setSelectedCVId] = useState("");
  const [selectedRole, setSelectedRole] = useState("No target role");
  const [result, setResult] = useState<ResumeScoreAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeScoreHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadHistory = async () => {
    const historyRes = await apiFetch("/resume/scores/history");
    const mappedHistory = ((historyRes.data || []) as BackendResumeScore[]).map(
      (item) => {
        const roleTitle = item.targetRoleId?.title || "No target role";
        const mappedResult = mapScoreResult(item, roleTitle);

        return {
          id: item._id,
          score: item.score || 0,
          roleTitle,
          createdAt: item.createdAt || "",
          missingKeywords: item.missingKeywords || [],
          result: mappedResult,
        };
      }
    );

    setHistory(mappedHistory);
  };

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);

        const [cvRes, jobRes] = await Promise.all([
          apiFetch("/cv"),
          apiFetch("/jobs/suggestions"),
        ]);

        const mappedCvs = ((cvRes.data || []) as BackendCv[]).map(mapBackendCv);
        const mappedRoles = ((jobRes.data || []) as BackendJobRole[]).map(
          (role) => ({
            id: role._id,
            title: role.title,
          })
        );

        setSavedCVs(mappedCvs);
        setRoles(mappedRoles);
        await loadHistory();
      } catch (error) {
        console.error("Failed to load resume score page data:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load resume score data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  const roleOptions = useMemo(() => {
    return ["No target role", ...roles.map((role) => role.title)];
  }, [roles]);

  const handleAnalyze = async () => {
    if (!selectedCVId) {
      alert("Please select a CV first");
      return;
    }

    try {
      setIsAnalyzing(true);

      const matchedRole = roles.find((role) => role.title === selectedRole);

      const body: { cvId: string; targetRoleId?: string } = {
        cvId: selectedCVId,
      };

      if (matchedRole && selectedRole !== "No target role") {
        body.targetRoleId = matchedRole.id;
      }

      const res = await apiFetch("/resume/score", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const analysis = mapScoreResult(
        res.data as BackendResumeScore,
        selectedRole
      );

      setResult(analysis);
      setSelectedHistoryId("");
      await loadHistory();
    } catch (error) {
      console.error("Failed to analyze resume:", error);
      alert(
        error instanceof Error ? error.message : "Failed to analyze resume"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = (item: ResumeScoreHistoryItem) => {
    setResult(item.result);
    setSelectedHistoryId(item.id);
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await apiFetch(`/resume/scores/${id}`, {
        method: "DELETE",
      });

      setHistory((prev) => prev.filter((item) => item.id !== id));

      if (selectedHistoryId === id) {
        setSelectedHistoryId("");
        setResult(null);
      }
    } catch (error) {
      console.error("Failed to delete resume score history:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete resume score history"
      );
    }
  };

  if (loading) return null;

  return (
    <div>
      <PageHeader
        title="Resume Score"
        subtitle="Get your CV scored and receive improvement suggestions."
      />

      <div className="space-y-6">
        <ResumeScoreForm
          savedCVs={savedCVs}
          selectedCVId={selectedCVId}
          selectedRole={selectedRole}
          onChangeCV={setSelectedCVId}
          onChangeRole={setSelectedRole}
          onAnalyze={handleAnalyze}
          roles={roleOptions}
        />

        {isAnalyzing && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 shadow-sm">
            Analyzing your CV...
          </div>
        )}

        <ResumeScoreResult result={result} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            Previous Score History
          </h3>

          {history.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No saved score history yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`w-full rounded-xl border p-4 transition ${
                    selectedHistoryId === item.id
                      ? "border-sky-300 bg-sky-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      type="button"
                      onClick={() => handleSelectHistory(item)}
                      className="flex-1 text-left"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.roleTitle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDateTime(item.createdAt)}
                          </p>
                        </div>

                        <div
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                            item.score >= 80
                              ? "bg-emerald-50 text-emerald-700"
                              : item.score >= 60
                              ? "bg-sky-50 text-sky-700"
                              : item.score >= 40
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          Score: {item.score}
                        </div>
                      </div>

                      {item.missingKeywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.missingKeywords
                            .slice(0, 5)
                            .map((keyword, index) => (
                              <span
                                key={`${item.id}-${keyword}-${index}`}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {keyword}
                              </span>
                            ))}
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(item.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
                      title="Delete history item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}