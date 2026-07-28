"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-6">
      <div className="mx-auto max-w-2xl text-center">

        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          COMBINE
        </p>

        <h1 className="mt-6 text-5xl font-extralight tracking-[-0.03em] text-black md:text-6xl">
          Something Went Wrong
        </h1>

        <p className="mx-auto mt-8 max-w-lg text-lg leading-8 text-neutral-500">
          An unexpected error occurred while loading this page.
          Please try again, or return to the homepage.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-4">

          <button
            onClick={reset}
            className="rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800"
          >
            Try Again
          </button>

<Link
  href="/"
  className="rounded-full border border-neutral-300 px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-neutral-700 transition hover:border-black hover:text-black"
>
  Back Home
</Link>

        </div>

      </div>
    </main>
  );
}