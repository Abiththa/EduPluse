import Link from "next/link";
import { ArrowRight } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
};

export default function FeatureCard({
  title,
  description,
  href,
  icon,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-sky-500">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-slate-300 transition group-hover:text-sky-500"
        />
      </div>

      <h3 className="text-[18px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-[15px] leading-7 text-slate-500">{description}</p>
    </Link>
  );
}