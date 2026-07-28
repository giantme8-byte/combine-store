import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  center = true,
}: Props) {
  return (
    <div
      className={`${
        center ? "mx-auto text-center" : ""
      } max-w-3xl`}
    >
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-5 text-5xl font-extralight tracking-tight md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-8 text-lg leading-8 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}