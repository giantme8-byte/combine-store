"use client";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput({
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by SKU, Product Name or Model..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
      />
    </div>
  );
}