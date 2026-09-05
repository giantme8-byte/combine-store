"use client";

import { useFormStatus } from "react-dom";
import Button from "./Button";

type SubmitButtonProps = {
  children: React.ReactNode;
  loadingText?: string;
  variant?:
    | "primary"
    | "secondary"
    | "danger";
  className?: string;
};

export default function SubmitButton({
  children,
  loadingText = "Saving...",
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      className={className}
    >
      {pending ? loadingText : children}
    </Button>
  );
}