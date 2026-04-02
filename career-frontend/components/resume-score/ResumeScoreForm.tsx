import type { SavedCVForScoring } from "@/types/resume-score";

type ResumeScoreFormProps = {
  savedCVs: SavedCVForScoring[];
  selectedCVId: string;
  selectedRole: string;
  onChangeCV: (value: string) => void;
  onChangeRole: (value: string) => void;
  onAnalyze: () => void;
  roles: string[];
};

export default function ResumeScoreForm({
  savedCVs,
  selectedCVId,
  selectedRole,
  onChangeCV,
  onChangeRole,
  onAnalyze,
  roles,
}: ResumeScoreFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select CV
          </label>
          <select
            value={selectedCVId}
            onChange={(e) => onChangeCV(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
          >
            <option value="">Choose a CV...</option>
            {savedCVs.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.fullName} ({cv.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Target Career Role (optional)
          </label>
          <select
            value={selectedRole}
            onChange={(e) => onChangeRole(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        className="mt-5 inline-flex items-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        Analyze CV
      </button>
    </div>
  );
}