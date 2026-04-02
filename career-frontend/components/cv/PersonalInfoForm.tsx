import { PersonalInfo } from "@/types/cv";

type PersonalInfoFormProps = {
  data: PersonalInfo;
};

export default function PersonalInfoForm({ data }: PersonalInfoFormProps) {
  const fields = [
    { label: "Full Name", value: data.fullName },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "Location", value: data.location },
    { label: "LinkedIn", value: data.linkedIn },
    { label: "GitHub", value: data.github },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-semibold text-slate-900">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {field.label}
            </label>
            <input
              defaultValue={field.value}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
        ))}
      </div>
    </section>
  );
}