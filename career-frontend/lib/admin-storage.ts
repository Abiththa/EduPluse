import {
  defaultCareerRoles,
  defaultRoadmaps,
  defaultTemplates,
} from "@/lib/admin-seed";
import type {
  AdminCareerRole,
  AdminRoadmap,
  AdminTemplate,
} from "@/types/admin";

const TEMPLATE_KEY = "admin-cv-templates";
const ROLE_KEY = "admin-career-roles";
const ROADMAP_KEY = "admin-roadmaps";

export function initializeAdminStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(TEMPLATE_KEY)) {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(defaultTemplates));
  }

  if (!localStorage.getItem(ROLE_KEY)) {
    localStorage.setItem(ROLE_KEY, JSON.stringify(defaultCareerRoles));
  }

  if (!localStorage.getItem(ROADMAP_KEY)) {
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(defaultRoadmaps));
  }
}

export function getAdminTemplates(): AdminTemplate[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || "[]");
}

export function setAdminTemplates(data: AdminTemplate[]) {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(data));
}

export function getAdminRoles(): AdminCareerRole[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(ROLE_KEY) || "[]");
}

export function setAdminRoles(data: AdminCareerRole[]) {
  localStorage.setItem(ROLE_KEY, JSON.stringify(data));
}

export function getAdminRoadmaps(): AdminRoadmap[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(ROADMAP_KEY) || "[]");
}

export function setAdminRoadmaps(data: AdminRoadmap[]) {
  localStorage.setItem(ROADMAP_KEY, JSON.stringify(data));
}