import {
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

type Props =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };

const Textarea = forwardRef<
  HTMLTextAreaElement,
  Props
>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        {...props}
        className={`
          min-h-[140px]
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
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;