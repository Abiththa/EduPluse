import type {
  ResumeScoreAnalysis,
  SavedCVForScoring,
} from "@/types/resume-score";
import type { AdminCareerRole } from "@/types/admin";

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function getCVText(cv: SavedCVForScoring) {
  const summary = cv.summary || "";
  const skillText = (cv.skills || []).join(" ");

  const experienceText = (cv.experience || [])
    .map(
      (item) =>
        `${item.position || ""} ${item.company || ""} ${item.description || ""}`
    )
    .join(" ");

  const projectText = (cv.projects || [])
    .map(
      (item) =>
        `${item.name || ""} ${item.description || ""} ${item.technologies || ""}`
    )
    .join(" ");

  const educationText = (cv.education || [])
    .map(
      (item) => `${item.degree || ""} ${item.field || ""} ${item.institution || ""}`
    )
    .join(" ");

  return normalize(
    `${summary} ${skillText} ${experienceText} ${projectText} ${educationText}`
  );
}

export function analyzeResume(
  cv: SavedCVForScoring,
  targetRole: string,
  adminRoles: AdminCareerRole[]
): ResumeScoreAnalysis {
  let completeness = 0;
  let structure = 0;
  let relevance = 0;
  let projectQuality = 0;

  const strengths: string[] = [];
  const improvements: string[] = [];
  const missingKeywords: string[] = [];

  const hasSummary = !!cv.summary?.trim();
  const hasSkills = (cv.skills || []).length > 0;
  const hasEnoughSkills = (cv.skills || []).length >= 3;
  const hasExperience = (cv.experience || []).some(
    (item) => item.company || item.position || item.description
  );
  const hasProjects = (cv.projects || []).some(
    (item) => item.name || item.description || item.technologies
  );
  const hasEducation = (cv.education || []).length > 0;

  if (hasSummary) completeness += 8;
  else improvements.push("Add a professional summary (at least 2-3 sentences)");

  if (hasSkills) completeness += 8;
  else improvements.push("Add at least 3-5 relevant skills");

  if (hasExperience) completeness += 5;
  else improvements.push("Add work experience or internships");

  if (hasProjects) completeness += 4;
  else improvements.push("Add projects to showcase your practical skills");

  if (hasEducation) completeness += 5;

  if (hasSummary && hasSkills && hasEducation) {
    strengths.push("Your CV includes core sections like summary, skills, and education");
  }

  structure += 8;

  if ((cv.experience || []).length > 0) structure += 7;
  if ((cv.projects || []).length > 0) structure += 5;
  if ((cv.skills || []).length >= 3) structure += 5;

  if ((cv.experience || []).some((item) => item.description?.trim())) {
    structure += 5;
  } else {
    improvements.push("Add detailed descriptions to your experience entries");
  }

  if (hasProjects) {
    const goodProjects = (cv.projects || []).filter(
      (item) => item.description?.trim() || item.technologies?.trim()
    ).length;

    projectQuality += goodProjects > 0 ? 15 : 0;

    if (goodProjects > 0) {
      strengths.push("You included project work that can strengthen your profile");
    } else {
      improvements.push("Improve your project descriptions and technologies used");
    }
  }

  if (hasEnoughSkills) {
    strengths.push("You have a visible skills section with multiple skills listed");
  }

  if (targetRole !== "No target role") {
    const matchedRole = adminRoles.find((role) => role.title === targetRole);
    const keywords = matchedRole?.keywords || [];
    const cvText = getCVText(cv);

    const matched = keywords.filter((keyword) =>
      cvText.includes(normalize(keyword))
    );
    const missing = keywords.filter(
      (keyword) => !cvText.includes(normalize(keyword))
    );

    const relevanceRatio = keywords.length === 0 ? 0 : matched.length / keywords.length;
    relevance = Math.round(relevanceRatio * 25);

    missingKeywords.push(...missing.slice(0, 8));

    if (matched.length >= 4) {
      strengths.push(`Your CV includes several keywords related to ${targetRole}`);
    } else {
      improvements.push(`Tailor your CV more closely to the ${targetRole} role`);
    }
  } else {
    relevance = 12;
  }

  const totalScore = Math.min(
    100,
    completeness + structure + relevance + projectQuality
  );

  if (strengths.length === 0) {
    strengths.push("You have started building a structured CV");
  }

  if (!cv.linkedIn && !cv.github) {
    improvements.push("Consider adding LinkedIn or GitHub links if relevant");
  }

  return {
    score: totalScore,
    breakdown: {
      completeness,
      structure,
      relevance,
      projectQuality,
    },
    strengths,
    improvements,
    missingKeywords,
  };
}