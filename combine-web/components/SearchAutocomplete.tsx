"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type { ProductSearchResult } from "@/types";

type SearchAutocompleteProps = {
  query: string;
};

export default function SearchAutocomplete({
  query,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const keyword = query.trim();

    setOpen(keyword.length >= 2);

    if (keyword.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(keyword)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setResults([]);
          setSelectedIndex(-1);
          return;
        }

        const data = await response.json();

        setResults(data);
        setSelectedIndex(-1);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(error);

        setResults([]);
        setSelectedIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!open) return;

      switch (event.key) {
        case "Escape":
          setOpen(false);
          setSelectedIndex(-1);
          break;

        case "ArrowDown":
          event.preventDefault();

          setSelectedIndex((prev) =>
            Math.min(prev + 1, results.length - 1)
          );
          break;

        case "ArrowUp":
          event.preventDefault();

          setSelectedIndex((prev) =>
            Math.max(prev - 1, 0)
          );
          break;

        case "Enter":
          if (
            selectedIndex >= 0 &&
            results[selectedIndex]?.slug
          ) {
            setOpen(false);
            setSelectedIndex(-1);

            router.push(
              `/shop/${results[selectedIndex].slug}`
            );
          }

          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    results,
    selectedIndex,
    router,
  ]);

  if (query.trim().length < 2) {
    return null;
  }

  if (!open) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[520px] overflow-y-auto overflow-x-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
    >
      {loading && (
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="h-16 w-16 animate-pulse rounded-2xl bg-neutral-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="h-5 w-40 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="px-6 py-6 text-center">
          <p className="text-base font-light text-neutral-900">
            No matching products found.
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Try another keyword.
          </p>
        </div>
      )}

      {!loading &&
        results.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => {
              if (!product.slug) return;

              setOpen(false);
              setSelectedIndex(-1);

              router.push(`/shop/${product.slug}`);
            }}
            onMouseEnter={() =>
              setSelectedIndex(index)
            }
            className={`flex w-full items-center gap-4 border-b border-neutral-100 px-5 py-4 text-left transition-colors duration-200 last:border-b-0 ${
              selectedIndex === index
                ? "bg-neutral-50"
                : "hover:bg-neutral-50"
            }`}
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={
                  product.images[0]?.url ??
                  "/placeholder.png"
                }
                alt={product.name}
                fill
                sizes="64px"
                className="object-contain p-2"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                {product.brand}
              </p>

              <p className="mt-1 truncate text-base font-light text-neutral-900">
                {product.name}
              </p>

              {product.model && (
                <p className="mt-1 text-sm text-neutral-500">
                  {product.model}
                </p>
              )}
            </div>
          </button>
        ))}

      {!loading && results.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setSelectedIndex(-1);

            router.push(
              `/shop?search=${encodeURIComponent(query)}`
            );
          }}
          className="w-full border-t border-neutral-200 bg-white px-6 py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
        >
          View All Results →
        </button>
      )}
    </div>
  );
}