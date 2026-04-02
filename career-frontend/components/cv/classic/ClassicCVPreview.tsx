import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  FolderKanban,
  Wrench,
} from "lucide-react";
import type { CVState } from "@/types/cv-builder";

type ClassicCVPreviewProps = {
  cvData: CVState;
  template: string;
};

function formatMonth(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (!year || monthIndex < 0 || monthIndex > 11) return value;
  return `${months[monthIndex]} ${year}`;
}

function formatDateRange(start?: string, end?: string) {
  const formattedStart = formatMonth(start || "");
  const formattedEnd = formatMonth(end || "");

  if (formattedStart && formattedEnd) return `${formattedStart} – ${formattedEnd}`;
  if (formattedStart) return `${formattedStart} – Present`;
  if (formattedEnd) return formattedEnd;
  return "";
}

function hasProjects(cvData: CVState) {
  return cvData.projects.some(
    (item) => item.name || item.link || item.description || item.technologies
  );
}

function hasExperience(cvData: CVState) {
  return cvData.experience.some(
    (item) =>
      item.company || item.position || item.start || item.end || item.description
  );
}

function cleanUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function PreviewShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      id="cv-preview"
      className={`mx-auto w-full max-w-[794px] bg-white text-slate-800 shadow-sm ${className}`}
      style={{
        minHeight: "1123px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function ContactRow({ cvData }: { cvData: CVState }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
      {cvData.email && (
        <span className="inline-flex items-center gap-1.5">
          <Mail size={12} />
          {cvData.email}
        </span>
      )}

      {cvData.phone && (
        <span className="inline-flex items-center gap-1.5">
          <Phone size={12} />
          {cvData.phone}
        </span>
      )}

      {cvData.location && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={12} />
          {cvData.location}
        </span>
      )}

      {cvData.linkedIn && (
        <span className="inline-flex items-center gap-1.5 break-all">
          <Linkedin size={12} />
          {cleanUrl(cvData.linkedIn)}
        </span>
      )}

      {cvData.github && (
        <span className="inline-flex items-center gap-1.5 break-all">
          <Github size={12} />
          {cleanUrl(cvData.github)}
        </span>
      )}
    </div>
  );
}

function renderClassic(cvData: CVState) {
  return (
    <PreviewShell className="rounded-2xl border border-slate-200 p-8">
      <div className="text-center">
        <h2 className="text-[24px] font-bold text-slate-900">
          {cvData.fullName || "Your Name"}
        </h2>
        <div className="flex justify-center">
          <ContactRow cvData={cvData} />
        </div>
      </div>

      {cvData.summary && (
        <section className="mt-6 border-t-2 border-slate-700 pt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Professional Summary
          </h3>
          <p className="mt-2 text-[12px] leading-6 text-slate-600">
            {cvData.summary}
          </p>
        </section>
      )}

      {cvData.education.length > 0 && (
        <section className="mt-6 border-t-2 border-slate-700 pt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Education
          </h3>

          <div className="mt-3 space-y-4 border-t border-slate-200 pt-3">
            {cvData.education.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {item.degree || "Degree"} in {item.field || "Field"}
                    </p>
                    <p className="text-[13px] text-slate-500">
                      {item.institution || "Institution"}
                    </p>
                  </div>

                  <p className="shrink-0 whitespace-nowrap text-[12px] text-slate-400">
                    {formatDateRange(item.start, item.end) || "Start – End"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasExperience(cvData) && (
        <section className="mt-6 border-t-2 border-slate-700 pt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Experience
          </h3>

          <div className="mt-3 space-y-4 border-t border-slate-200 pt-3">
            {cvData.experience.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {item.position || "Position"}
                    </p>
                    <p className="text-[13px] text-slate-500">
                      {item.company || "Company"}
                    </p>
                  </div>

                  {(item.start || item.end) && (
                    <p className="shrink-0 whitespace-nowrap text-[12px] text-slate-400">
                      {formatDateRange(item.start, item.end)}
                    </p>
                  )}
                </div>

                {item.description && (
                  <p className="text-[12px] leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasProjects(cvData) && (
        <section className="mt-6 border-t-2 border-slate-700 pt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Projects
          </h3>

          <div className="mt-3 space-y-4 border-t border-slate-200 pt-3">
            {cvData.projects.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[14px] font-semibold text-slate-800">
                    {item.name || "Project Name"}
                  </p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 whitespace-nowrap text-[12px] text-sky-700 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>

                {item.description && (
                  <p className="text-[12px] leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}

                {item.technologies && (
                  <p className="text-[12px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Technologies:
                    </span>{" "}
                    {item.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cvData.skills.length > 0 && (
        <section className="mt-6 border-t-2 border-slate-700 pt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Skills
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </PreviewShell>
  );
}

function renderModern(cvData: CVState) {
  return (
    <PreviewShell className="overflow-hidden rounded-2xl border border-slate-200">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "170px 1fr",
          minHeight: "1123px",
        }}
      >
        <div
          style={{
            backgroundColor: "#0891b2",
            color: "#ffffff",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            {cvData.fullName?.charAt(0) || "A"}
          </div>

          <h2 className="text-[18px] font-bold leading-tight">
            {cvData.fullName || "Your Name"}
          </h2>

          <div className="mt-5 space-y-3 text-[11px]">
            {cvData.email && (
              <p className="flex items-start gap-2">
                <Mail size={12} className="mt-0.5 shrink-0" />
                <span>{cvData.email}</span>
              </p>
            )}

            {cvData.phone && (
              <p className="flex items-center gap-2">
                <Phone size={12} className="shrink-0" />
                <span>{cvData.phone}</span>
              </p>
            )}

            {cvData.location && (
              <p className="flex items-center gap-2">
                <MapPin size={12} className="shrink-0" />
                <span>{cvData.location}</span>
              </p>
            )}
          </div>

          {cvData.skills.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }}
                    className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6">
          <div className="space-y-5">
            {cvData.summary && (
              <section>
                <h3 className="text-[13px] font-bold uppercase text-cyan-700">
                  Summary
                </h3>
                <p className="mt-2 text-[12px] leading-6 text-slate-600">
                  {cvData.summary}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-[13px] font-bold uppercase text-cyan-700">
                Education
              </h3>

              <div className="mt-2 space-y-3">
                {cvData.education.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800">
                          {item.degree || "Degree"} in {item.field || "Field"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.institution || "Institution"}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-[11px] text-slate-400">
                        {formatDateRange(item.start, item.end)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {hasExperience(cvData) && (
              <section>
                <h3 className="text-[13px] font-bold uppercase text-cyan-700">
                  Experience
                </h3>

                <div className="mt-2 space-y-3">
                  {cvData.experience.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800">
                            {item.position || "Position"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.company || "Company"}
                          </p>
                        </div>

                        {(item.start || item.end) && (
                          <p className="whitespace-nowrap text-[11px] text-slate-400">
                            {formatDateRange(item.start, item.end)}
                          </p>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-1 text-[11px] text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasProjects(cvData) && (
              <section>
                <h3 className="text-[13px] font-bold uppercase text-cyan-700">
                  Projects
                </h3>

                <div className="mt-2 space-y-3">
                  {cvData.projects.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between gap-3">
                        <p className="text-[13px] font-semibold text-slate-800">
                          {item.name || "Project Name"}
                        </p>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="whitespace-nowrap text-[11px] text-cyan-700 hover:underline"
                          >
                            View
                          </a>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-1 text-[11px] text-slate-600">
                          {item.description}
                        </p>
                      )}

                      {item.technologies && (
                        <p className="mt-1 text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Technologies:
                          </span>{" "}
                          {item.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

function renderMinimal(cvData: CVState) {
  return (
    <PreviewShell className="rounded-2xl border border-slate-200 p-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-[30px] font-light tracking-wide text-slate-900">
          {cvData.fullName || "Your Name"}
        </h2>
        <ContactRow cvData={cvData} />
      </div>

      <div className="mt-5 space-y-5">
        {cvData.summary && (
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Profile
            </h3>
            <p className="mt-2 text-[12px] leading-6 text-slate-600">
              {cvData.summary}
            </p>
          </section>
        )}

        <section>
          <h3 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Education
          </h3>

          <div className="mt-2 space-y-3">
            {cvData.education.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-slate-800">
                      {item.degree || "Degree"} in {item.field || "Field"}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {item.institution || "Institution"}
                    </p>
                  </div>

                  <p className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                    {formatDateRange(item.start, item.end)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {hasExperience(cvData) && (
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Experience
            </h3>

            <div className="mt-2 space-y-3">
              {cvData.experience.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-slate-800">
                        {item.position || "Position"}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {item.company || "Company"}
                      </p>
                    </div>

                    {(item.start || item.end) && (
                      <p className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                        {formatDateRange(item.start, item.end)}
                      </p>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[12px] leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {hasProjects(cvData) && (
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Projects
            </h3>

            <div className="mt-2 space-y-3">
              {cvData.projects.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[14px] font-medium text-slate-800">
                      {item.name || "Project Name"}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 whitespace-nowrap text-[12px] text-slate-500 hover:underline"
                      >
                        View Project
                      </a>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[12px] leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {item.technologies && (
                    <p className="text-[11px] text-slate-400">
                      {item.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {cvData.skills.length > 0 && (
          <section>
            <h3 className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
              <Wrench size={11} />
              Skills
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </PreviewShell>
  );
}

function renderProfessional(cvData: CVState) {
  return (
    <PreviewShell className="rounded-2xl border border-slate-200 p-8">
      <div className="border-l-4 border-emerald-600 pl-4">
        <h2 className="text-[24px] font-bold text-slate-900">
          {cvData.fullName || "Your Name"}
        </h2>
        <ContactRow cvData={cvData} />
      </div>

      <div className="mt-6 space-y-6">
        {cvData.summary && (
          <section>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Summary
            </h3>
            <div className="rounded-lg bg-slate-50 p-4 text-[12px] leading-6 text-slate-600">
              {cvData.summary}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Education
          </h3>

          <div className="space-y-3">
            {cvData.education.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {item.degree || "Degree"} in {item.field || "Field"}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {item.institution || "Institution"}
                    </p>
                  </div>

                  <p className="shrink-0 whitespace-nowrap text-[12px] text-slate-400">
                    {formatDateRange(item.start, item.end)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {hasExperience(cvData) && (
          <section>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Experience
            </h3>

            <div className="space-y-3">
              {cvData.experience.map((item) => (
                <div key={item.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-slate-800">
                        {item.position || "Position"}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {item.company || "Company"}
                      </p>
                    </div>

                    {(item.start || item.end) && (
                      <p className="shrink-0 whitespace-nowrap text-[12px] text-slate-400">
                        {formatDateRange(item.start, item.end)}
                      </p>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 text-[12px] leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {hasProjects(cvData) && (
          <section>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Projects
            </h3>

            <div className="space-y-3">
              {cvData.projects.map((item) => (
                <div key={item.id} className="rounded-lg bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {item.name || "Project Name"}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 whitespace-nowrap text-[12px] text-emerald-700 hover:underline"
                      >
                        View Project
                      </a>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 text-[12px] leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}

                  {item.technologies && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Technologies:
                      </span>{" "}
                      {item.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {cvData.skills.length > 0 && (
          <section>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Core Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </PreviewShell>
  );
}

export default function ClassicCVPreview({
  cvData,
  template,
}: ClassicCVPreviewProps) {
  const normalizedTemplate = (template || "classic").toLowerCase().trim();

  if (normalizedTemplate === "modern") return renderModern(cvData);
  if (normalizedTemplate === "minimal") return renderMinimal(cvData);
  if (normalizedTemplate === "professional") return renderProfessional(cvData);
  return renderClassic(cvData);
}