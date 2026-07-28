"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main
      role="main"
      className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-8 text-center"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Something went wrong
      </p>

      <h1 className="mt-4 text-4xl font-light">
        We couldn&apos;t load this page.
      </h1>

      <p className="mt-6 max-w-lg text-neutral-600">
        Please try again. If the problem continues, contact our team.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl bg-black px-8 py-3 text-white transition hover:bg-neutral-800"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="rounded-2xl border border-neutral-200 px-8 py-3 transition hover:bg-neutral-100"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}