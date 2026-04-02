type RoadmapProgressProps = {
  title: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
};

export default function RoadmapProgress({
  title,
  progress,
  totalSteps,
  completedSteps,
}: RoadmapProgressProps) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-[15px] text-slate-500">
            {completedSteps} of {totalSteps} steps completed
          </p>
        </div>

        <div className="text-[24px] font-bold text-sky-500">{progress}%</div>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-200">
        <div
          className="h-2.5 rounded-full bg-sky-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}