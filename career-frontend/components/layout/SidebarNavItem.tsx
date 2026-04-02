"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarNavItemProps = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export default function SidebarNavItem({
  label,
  href,
  icon: Icon,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
        isActive
          ? "bg-slate-800 text-sky-400"
          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}