type ScoreResultCardProps = {
  score: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
};

export default function ScoreResultCard({
  score,
  strengths,
  improvements,
  missingKeywords,
}: ScoreResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Resume Score</h2>
          <p className="mt-2 text-slate-500">
            Match quality for your selected target role.
          </p>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-2xl font-bold text-sky-600">
          {score}%
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Strengths</h3>
          <ul className="space-y-2">
            {strengths.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {improvements.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}