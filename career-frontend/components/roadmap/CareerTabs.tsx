type CareerTabsProps = {
  items: string[];
  activeItem: string;
  onChange: (value: string) => void;
};

export default function CareerTabs({
  items,
  activeItem,
  onChange,
}: CareerTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {items.map((item) => {
        const isActive = item === activeItem;

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "bg-sky-500 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}