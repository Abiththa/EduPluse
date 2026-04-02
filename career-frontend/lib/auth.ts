import type { MockSession } from "@/types/auth";

const SESSION_KEY = "mock-session";

export const ADMIN_EMAIL = "admin@skillswap.com";

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export function setMockSession(session: MockSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearMockSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isAdminLogin(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function getNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "Student";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}