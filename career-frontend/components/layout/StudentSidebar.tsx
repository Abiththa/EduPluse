"use client";

import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../common/Logo";
import SidebarNavItem from "./SidebarNavItem";
import { studentNavItems } from "@/lib/constants";
import { clearMockSession, getMockSession } from "@/lib/auth";

type SessionUser = {
  name: string;
  email: string;
  role: string;
};

export default function StudentSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const session = getMockSession();
    if (session) {
      setUser(session);
    }
  }, []);

  const handleLogout = () => {
    clearMockSession();
    router.push("/login");
  };

  return (
    <aside className="flex min-h-screen w-[260px] flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-5 py-5">
        <Logo />
      </div>

      <div className="px-4 py-4">
        <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-400">
          Student
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3">
        {studentNavItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </nav>

      <div className="border-t border-slate-800 px-5 py-5">
        <div className="mb-5">
          <p className="text-[15px] font-semibold text-white">
            {user?.name || "Student"}
          </p>
          <p className="text-sm text-slate-400">
            {user?.email || "student@email.com"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-300 transition hover:text-white"
        >
          <LogOut size={18} />
          <span className="text-[15px]">Log out</span>
        </button>
      </div>
    </aside>
  );
}