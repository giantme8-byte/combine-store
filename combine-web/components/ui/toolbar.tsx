import * as React from "react";
import { cn } from "@/lib/utils";

type ToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function Toolbar({
  className,
  ...props
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-4 md:flex-row md:items-center md:justify-between",
        className
      )}
      {...props}
    />
  );
}

export function ToolbarLeft({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-3",
        className
      )}
      {...props}
    />
  );
}

export function ToolbarRight({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        className
      )}
      {...props}
    />
  );
}