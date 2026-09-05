type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div
      className="
        mb-8
        flex
        flex-col
        gap-5
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* ============================================================
          TITLE
          ============================================================ */}
      <div className="min-w-0">
        <h1 className="text-4xl font-light">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {/* ============================================================
          ACTIONS
          ============================================================ */}
      {children && (
        <div
          className="
            flex
            w-full
            min-w-0
            gap-2
            sm:w-auto
            sm:shrink-0
            sm:gap-3
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}