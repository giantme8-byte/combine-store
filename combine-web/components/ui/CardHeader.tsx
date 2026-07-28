type CardHeaderProps = {
  title: string;
  description?: string;
};

export default function CardHeader({
  title,
  description,
}: CardHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-neutral-500">
          {description}
        </p>
      )}
    </div>
  );
}