import { InputHTMLAttributes } from "react";

type CheckboxProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

export default function Checkbox({
  label,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        {...props}
        className={`h-4 w-4 rounded border-gray-300 ${className}`}
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}