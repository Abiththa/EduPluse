import { FileText } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  button?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  button,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
      <div className="mb-4 text-slate-300">
        <FileText size={54} strokeWidth={1.5} />
      </div>

      <h3 className="text-3xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 max-w-xl text-xl text-slate-500">{description}</p>
      {button ? <div className="mt-6">{button}</div> : null}
    </div>
  );
}