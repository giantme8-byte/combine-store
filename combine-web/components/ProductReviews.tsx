"use client";

import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  verifiedPurchase: boolean;
  customerName: string | null;
  createdAt: string;
};

type ReviewsResponse = {
  success: boolean;
  summary?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews?: Review[];
};

type ProductReviewsProps = {
  productId: number;
};

function Stars({
  rating,
  size = "text-sm",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
              ? "text-black"
              : "text-neutral-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-MY",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [data, setData] =
    useState<ReviewsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/products/${productId}/reviews`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as ReviewsResponse;

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "LOAD PRODUCT REVIEWS ERROR:",
          error
        );

        if (!cancelled) {
          setData({
            success: false,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  if (loading) {
    return (
      <section className="mt-16 border-t border-neutral-200 pt-12">
        <div className="animate-pulse">
          <div className="h-6 w-48 rounded bg-neutral-100" />
          <div className="mt-6 h-24 rounded bg-neutral-50" />
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  if (!data?.success) {
    return null;
  }

  const summary = data.summary ?? {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  const reviews = data.reviews ?? [];

  // ----------------------------------------------------------
  // NO REVIEWS
  // ----------------------------------------------------------

  if (summary.totalReviews === 0) {
    return (
      <section className="mt-16 border-t border-neutral-200 pt-12">
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-wide">
            Customer Reviews
          </h2>

          <p className="mt-3 text-sm text-neutral-500">
            No reviews yet.
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            Be the first customer to share your
            experience.
          </p>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------
  // REVIEW SUMMARY
  // ----------------------------------------------------------

  return (
    <section className="mt-16 border-t border-neutral-200 pt-12">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
            Customer Feedback
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-wide">
            Customer Reviews
          </h2>
        </div>

        {/* SUMMARY */}
        <div className="mt-10 grid gap-8 border-y border-neutral-200 py-8 md:grid-cols-[180px_1fr]">
          {/* AVERAGE */}
          <div className="flex flex-col items-center justify-center border-b border-neutral-200 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div className="text-4xl font-light">
              {summary.averageRating.toFixed(1)}
            </div>

            <div className="mt-2">
              <Stars
                rating={Math.round(
                  summary.averageRating
                )}
                size="text-base"
              />
            </div>

            <p className="mt-2 text-xs text-neutral-500">
              {summary.totalReviews}{" "}
              {summary.totalReviews === 1
                ? "review"
                : "reviews"}
            </p>
          </div>

          {/* DISTRIBUTION */}
          <div className="flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map(
              (rating) => {
                const count =
                  summary.ratingDistribution[
                    rating as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                  ];

                const percentage =
                  summary.totalReviews > 0
                    ? (count /
                        summary.totalReviews) *
                      100
                    : 0;

                return (
                  <div
                    key={rating}
                    className="flex items-center gap-3"
                  >
                    <span className="w-8 text-xs text-neutral-500">
                      {rating} ★
                    </span>

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-black transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-6 text-right text-xs text-neutral-400">
                      {count}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="divide-y divide-neutral-200">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="py-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Stars
                      rating={review.rating}
                    />

                    {review.verifiedPurchase && (
                      <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {review.title && (
                    <h3 className="mt-3 text-sm font-medium">
                      {review.title}
                    </h3>
                  )}
                </div>

                <time
                  dateTime={review.createdAt}
                  className="text-xs text-neutral-400"
                >
                  {formatDate(
                    review.createdAt
                  )}
                </time>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600">
                {review.comment}
              </p>

              <p className="mt-4 text-xs text-neutral-500">
                {review.customerName ||
                  "Customer"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}