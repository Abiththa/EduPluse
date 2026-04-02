type StatCardProps = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-[14px] font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-[24px] font-bold text-slate-900">{value}</h3>
    </div>
  );
}