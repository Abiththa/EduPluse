type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-bold leading-tight text-slate-900 md:text-[32px]">
          {title}
        </h1>
        <p className="mt-1 text-[15px] text-slate-500 md:text-[16px]">
          {subtitle}
        </p>
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}