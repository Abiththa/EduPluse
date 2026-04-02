type SkillsFormProps = {
  items: string[];
};

export default function SkillsForm({ items }: SkillsFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Skills</h2>
        <button className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
          Add Skill
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}