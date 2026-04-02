import { AlertTriangle, Lightbulb } from "lucide-react";
import type { ResumeScoreAnalysis } from "@/types/resume-score";

type ResumeScoreResultProps = {
  result: ResumeScoreAnalysis | null;
};

export default function ResumeScoreResult({
  result,
}: ResumeScoreResultProps) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center text-slate-500">
          <p className="text-lg font-medium">No CV analysis yet</p>
          <p className="mt-2 text-sm">
            Select a CV and click Analyze CV to see your score.
          </p>
        </div>
      </div>
    );
  }

  const strengths =
    result.sections
      ?.filter((section) => section.score >= 60)
      .map((section) => section.feedback) || [];

  const improvements =
    result.suggestions?.length > 0
      ? result.suggestions
      : result.sections
          ?.filter((section) => section.score < 60)
          .map((section) => section.feedback) || [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2
            className={`text-6xl font-bold ${
              result.score >= 80
                ? "text-emerald-500"
                : result.score >= 60
                ? "text-sky-500"
                : result.score >= 40
                ? "text-amber-500"
                : "text-red-500"
            }`}
          >
            {result.score}
          </h2>
          <p className="mt-2 text-sm text-slate-500">out of 100</p>
          <p className="mt-3 text-sm font-medium text-slate-700">
            {result.rating}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {(result.sections || []).map((section, index) => (
            <div key={`${section.title}-${index}`} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{section.title}</span>
                <span className="font-medium text-slate-800">
                  {section.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-500">{section.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <h3 className="text-xl font-semibold text-slate-900">Strengths</h3>
          </div>

          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((item, index) => (
                <li key={index} className="text-sm text-slate-600">
                  • {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No major strengths identified yet.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="text-xl font-semibold text-slate-900">
              Areas to Improve
            </h3>
          </div>

          {improvements.length > 0 ? (
            <ul className="space-y-3">
              {improvements.map((item, index) => (
                <li key={index} className="text-sm text-slate-600">
                  • {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No major improvements suggested.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-slate-900">
            Missing Keywords
          </h3>

          {result.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No major keywords missing for the selected role.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}