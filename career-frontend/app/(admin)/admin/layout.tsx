"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getMockSession } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getMockSession();

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.role !== "admin") {
      router.push("/student/dashboard");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 px-8 py-6">{children}</main>
    </div>
  );
}