"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  GraduationCap,
  LayoutDashboard,
  FileText,
  Briefcase,
  Map,
  ClipboardList,
} from "lucide-react";
import { clearMockSession } from "@/lib/auth";

const navItems = [
  {
    label: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "CV Templates",
    href: "/admin/cv-templates",
    icon: FileText,
  },
  {
    label: "Career Roles",
    href: "/admin/career-roles",
    icon: Briefcase,
  },
  {
    label: "Roadmaps",
    href: "/admin/roadmaps",
    icon: Map,
  },
  {
    label: "Job Roles",
    href: "/admin/job-roles",
    icon: ClipboardList,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearMockSession();
    router.push("/login");
  };

  return (
    <aside className="flex min-h-screen w-[260px] flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-5 py-5">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
            <GraduationCap size={18} />
          </div>

          <span className="text-[15px] font-bold">
            EDU<span className="text-sky-400">Pulse</span>
          </span>
        </Link>
      </div>

      <div className="px-4 py-4">
        <span className="inline-flex rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                isActive
                  ? "bg-slate-800 text-sky-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-5 py-5">
        <div className="mb-5">
          <p className="text-[15px] font-semibold">Admin User</p>
          <p className="text-sm text-slate-400">admin@skillswap.com</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-300 hover:text-white"
        >
          <LogOut size={18} />
          <span className="text-[15px]">Log out</span>
        </button>
      </div>
    </aside>
  );
}