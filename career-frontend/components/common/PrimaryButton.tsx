import Link from "next/link";
import { Plus } from "lucide-react";

type PrimaryButtonProps = {
  children: React.ReactNode;
  href?: string;
  icon?: boolean;
};

export default function PrimaryButton({
  children,
  href,
  icon = false,
}: PrimaryButtonProps) {
  const content = (
    <>
      {icon ? <Plus size={18} /> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-600"
      >
        {content}
      </Link>
    );
  }

  return (
    <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-600">
      {content}
    </button>
  );
}