import { EducationItem } from "@/types/cv";

type EducationFormProps = {
  items: EducationItem[];
};

export default function EducationForm({ items }: EducationFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Education</h2>
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-3"
          >
            <input
              defaultValue={item.degree}
              placeholder="Degree"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
            <input
              defaultValue={item.institution}
              placeholder="Institution"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
            <input
              defaultValue={item.year}
              placeholder="Year"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}