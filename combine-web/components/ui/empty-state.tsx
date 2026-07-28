import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-8 py-16 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-neutral-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-medium text-neutral-900">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}