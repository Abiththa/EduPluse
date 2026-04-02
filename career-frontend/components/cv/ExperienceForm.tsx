import { ExperienceItem } from "@/types/cv";

type ExperienceFormProps = {
  items: ExperienceItem[];
};

export default function ExperienceForm({ items }: ExperienceFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Experience</h2>
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="space-y-4 rounded-2xl border border-slate-200 p-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                defaultValue={item.role}
                placeholder="Role"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
              <input
                defaultValue={item.company}
                placeholder="Company"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <input
              defaultValue={item.duration}
              placeholder="Duration"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />

            <textarea
              defaultValue={item.description}
              rows={4}
              placeholder="Description"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}