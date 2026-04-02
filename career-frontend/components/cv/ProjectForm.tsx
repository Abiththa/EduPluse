import { ProjectItem } from "@/types/cv";

type ProjectFormProps = {
  items: ProjectItem[];
};

export default function ProjectForm({ items }: ProjectFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="space-y-4 rounded-2xl border border-slate-200 p-4"
          >
            <input
              defaultValue={item.title}
              placeholder="Project Title"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />

            <textarea
              defaultValue={item.description}
              rows={4}
              placeholder="Project Description"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}