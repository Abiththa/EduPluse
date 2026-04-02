type AdminStatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function AdminStatCard({
  title,
  value,
  icon,
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}