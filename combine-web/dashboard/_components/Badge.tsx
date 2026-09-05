type BadgeProps = {
  children: React.ReactNode;
  variant?:
    | "success"
    | "danger"
    | "warning"
    | "secondary"
    | "primary";
};

export default function Badge({
  children,
  variant = "success",
}: BadgeProps) {
  const styles = {
    success:
      "bg-green-100 text-green-700 border border-green-200",

    danger:
      "bg-red-100 text-red-700 border border-red-200",

    warning:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",

    secondary:
      "bg-neutral-100 text-neutral-700 border border-neutral-200",

    primary:
      "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        whitespace-nowrap
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
}