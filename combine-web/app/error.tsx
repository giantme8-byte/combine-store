"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-8">
      <div className="max-w-3xl text-center">

        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          ERROR
        </p>

        <h1
          className="
            mt-6
            text-6xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            md:text-7xl
          "
        >
          Something Went Wrong
        </h1>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          An unexpected error occurred. Please try again or return
          to the homepage.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-5">

          <button
            onClick={() => reset()}
            className="
              inline-flex
              items-center
              rounded-full
              bg-black
              px-10
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
            "
          >
            Try Again
          </button>

          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-neutral-300
              px-10
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-700
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#C8A96A]
              hover:text-[#C8A96A]
              hover:shadow-lg
            "
          >
            Return Home
          </Link>

        </div>

      </div>
    </main>
  );
}