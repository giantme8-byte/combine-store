import {
  SelectHTMLAttributes,
  forwardRef,
} from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, className = "", children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <select
          ref={ref}
          {...props}
          className={`
            w-full
            rounded-2xl
            border
            border-gray-300
            bg-white
            px-5
            py-3
            outline-none
            transition-all
            duration-300
            focus:border-black
            focus:ring-2
            focus:ring-black/10
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            ${className}
          `}
        >
          {children}
        </select>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;