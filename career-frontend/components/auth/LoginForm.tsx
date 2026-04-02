"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import {
  ADMIN_EMAIL,
  getNameFromEmail,
  isAdminLogin,
  setMockSession,
} from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isAdminLogin(normalizedEmail)) {
      setMockSession({
        email: normalizedEmail,
        role: "admin",
        name: "Admin User",
      });

      router.push("/admin/dashboard");
      return;
    }

    setMockSession({
      email: normalizedEmail,
      role: "student",
      name: getNameFromEmail(normalizedEmail),
    });

    router.push("/student/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-white">
            <GraduationCap size={28} />
          </div>

          <h1 className="text-[34px] font-bold text-slate-900">
            <span>EDU</span>
            <span className="text-sky-500">Pulse</span>
          </h1>

          <p className="mt-3 text-[15px] text-slate-500">
            Career Management System
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillswap.com"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-600"
            >
              Sign in
            </button>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-700">Admin:</span>{" "}
              {ADMIN_EMAIL}
            </p>
           
          </div>
        </form>
      </div>
    </div>
  );
}