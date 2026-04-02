type SummaryFormProps = {
  value: string;
};

export default function SummaryForm({ value }: SummaryFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold text-slate-900">
        Professional Summary
      </h2>

      <textarea
        defaultValue={value}
        rows={5}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
    </section>
  );
}