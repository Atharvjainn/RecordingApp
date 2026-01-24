type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  highlight?: "pink";
};

export function Select({
  label,
  value,
  options,
  onChange,
  highlight,
}: SelectProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm focus:outline-none
            ${
              highlight
                ? "border-pink-400 bg-pink-50 text-pink-600"
                : "border-gray-200 bg-white text-gray-700"
            }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          ▼
        </span>
      </div>
    </div>
  );
}
