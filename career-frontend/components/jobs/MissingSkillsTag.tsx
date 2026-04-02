type MissingSkillsTagProps = {
  skill: string;
};

export default function MissingSkillsTag({ skill }: MissingSkillsTagProps) {
  return (
    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      {skill}
    </span>
  );
}