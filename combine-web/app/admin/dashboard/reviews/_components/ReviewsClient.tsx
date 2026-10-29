"use client";

import { useMemo, useState } from "react";

type ReviewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type ProductImage = {
  id: number;
  url: string;
  publicId: string;
  sortOrder: number;
  altText: string | null;
  caption: string | null;
  type: string;
  productId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type Review = {
  id: number;

  rating: number;

  title: string | null;

  comment: string | null;

  status: ReviewStatus;

  verifiedPurchase: boolean;

  customerName: string | null;

  createdAt: string;

  user: {
    id: number;
    name: string | null;
    email: string;
  };

  product: {
    id: number;
    name: string;
    brand: string;
    sku: string | null;
    images: ProductImage[];
  };

  orderItem: {
    id: number;
    orderId: number;
    sku: string | null;
    color: string | null;
    variant: string | null;
    quantity: number;
    unitPrice: unknown;
  };
};

type Summary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type ReviewsClientProps = {
  initialReviews: Review[];
  initialSummary: Summary;
};

// ============================================================
// STARS
// ============================================================

function Stars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(
        (star) => (
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
        )
      )}
    </div>
  );
}

// ============================================================
// DATE
// ============================================================

function formatDate(
  date: string
) {
  return new Date(
    date
  ).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ============================================================
// STATUS STYLE
// ============================================================

function getStatusClass(
  status: ReviewStatus
) {
  switch (status) {
    case "APPROVED":
      return "bg-neutral-100 text-neutral-700";

    case "REJECTED":
      return "bg-neutral-100 text-neutral-400";

    default:
      return "bg-black text-white";
  }
}

// ============================================================
// REVIEWS CLIENT
// ============================================================

export default function ReviewsClient({
  initialReviews,
  initialSummary,
}: ReviewsClientProps) {
  const [reviews, setReviews] =
    useState(initialReviews);

  const [summary, setSummary] =
    useState(initialSummary);

  const [filter, setFilter] =
    useState<
      "ALL" | ReviewStatus
    >("ALL");

  const [search, setSearch] =
    useState("");

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  // ==========================================================
  // FILTER REVIEWS
  // ==========================================================

  const filteredReviews =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return reviews.filter(
        (review) => {
          const matchesStatus =
            filter === "ALL" ||
            review.status === filter;

          if (!matchesStatus) {
            return false;
          }

          if (!keyword) {
            return true;
          }

          return (
            review.product.name
              .toLowerCase()
              .includes(keyword) ||
            review.product.brand
              .toLowerCase()
              .includes(keyword) ||
            (
              review.product.sku ||
              ""
            )
              .toLowerCase()
              .includes(keyword) ||
            (
              review.comment ||
              ""
            )
              .toLowerCase()
              .includes(keyword) ||
            (
              review.customerName ||
              ""
            )
              .toLowerCase()
              .includes(keyword)
          );
        }
      );
    }, [
      reviews,
      filter,
      search,
    ]);

  // ==========================================================
  // UPDATE REVIEW
  // ==========================================================

  async function updateReview(
    reviewId: number,
    action:
      | "APPROVE"
      | "REJECT"
  ) {
    setError("");
    setLoadingId(reviewId);

    try {
      const response =
        await fetch(
          "/api/admin/reviews",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              reviewId,
              action,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ||
            "Unable to update review."
        );

        return;
      }

      const newStatus: ReviewStatus =
        action === "APPROVE"
          ? "APPROVED"
          : "REJECTED";

      const previousReview =
        reviews.find(
          (review) =>
            review.id === reviewId
        );

      // --------------------------------------------------------
      // UPDATE REVIEW
      // --------------------------------------------------------

      setReviews(
        (current) =>
          current.map(
            (review) =>
              review.id === reviewId
                ? {
                    ...review,
                    status:
                      newStatus,
                  }
                : review
          )
      );

      // --------------------------------------------------------
      // UPDATE SUMMARY
      // --------------------------------------------------------

      setSummary(
        (current) => {
          if (
            !previousReview ||
            previousReview.status ===
              newStatus
          ) {
            return current;
          }

          const next = {
            ...current,
          };

          // Remove previous status
          if (
            previousReview.status ===
            "PENDING"
          ) {
            next.pending =
              Math.max(
                0,
                next.pending - 1
              );
          }

          if (
            previousReview.status ===
            "APPROVED"
          ) {
            next.approved =
              Math.max(
                0,
                next.approved - 1
              );
          }

          if (
            previousReview.status ===
            "REJECTED"
          ) {
            next.rejected =
              Math.max(
                0,
                next.rejected - 1
              );
          }

          // Add new status
          if (
            newStatus ===
            "APPROVED"
          ) {
            next.approved++;
          }

          if (
            newStatus ===
            "REJECTED"
          ) {
            next.rejected++;
          }

          return next;
        }
      );
    } catch (error) {
      console.error(
        "UPDATE REVIEW ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoadingId(null);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="px-6 py-8 lg:px-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs text-neutral-400">
            Dashboard / Reviews
          </div>

          <h1 className="mt-2 text-2xl font-medium tracking-tight">
            Reviews
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage customer reviews
            and verified purchases.
          </p>
        </div>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* TOTAL */}
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-400">
            Total Reviews
          </p>

          <p className="mt-2 text-2xl font-medium">
            {summary.total}
          </p>
        </div>

        {/* PENDING */}
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-400">
            Pending
          </p>

          <p className="mt-2 text-2xl font-medium">
            {summary.pending}
          </p>
        </div>

        {/* APPROVED */}
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-400">
            Approved
          </p>

          <p className="mt-2 text-2xl font-medium">
            {summary.approved}
          </p>
        </div>

        {/* REJECTED */}
        <div className="border border-neutral-200 bg-white p-5">
          <p className="text-xs text-neutral-400">
            Rejected
          </p>

          <p className="mt-2 text-2xl font-medium">
            {summary.rejected}
          </p>
        </div>
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="mt-8 flex flex-col gap-3 lg:flex-row">
        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search reviews..."
          className="h-11 flex-1 border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-black"
        />

        {/* STATUS */}
        <select
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value as
                | "ALL"
                | ReviewStatus
            )
          }
          className="h-11 border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-black"
        >
          <option value="ALL">
            All Reviews
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-4 border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {error}
        </div>
      )}

      {/* ======================================================
          REVIEWS
      ====================================================== */}

      <div className="mt-6 space-y-4">
        {filteredReviews.length ===
        0 ? (
          <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-neutral-500">
              No reviews found.
            </p>
          </div>
        ) : (
          filteredReviews.map(
            (review) => {
              const productImage =
                review.product.images?.[0]
                  ?.url || null;

              return (
                <div
                  key={review.id}
                  className="border border-neutral-200 bg-white"
                >
                  <div className="p-6">
                    {/* ==================================================
                        PRODUCT / STATUS
                    ================================================== */}

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* PRODUCT */}
                      <div className="flex gap-4">
                        {/* PRODUCT IMAGE */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-neutral-100">
                          {productImage ? (
                            <img
                              src={
                                productImage
                              }
                              alt={
                                review
                                  .product
                                  .name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* PRODUCT INFO */}
                        <div>
                          <p className="text-sm font-medium">
                            {
                              review
                                .product
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-neutral-400">
                            {
                              review
                                .product
                                .brand
                            }{" "}
                            ·{" "}
                            {
                              review
                                .product
                                .sku
                            }
                          </p>

                          <p className="mt-2 text-xs text-neutral-400">
                            Order #
                            {
                              review
                                .orderItem
                                .orderId
                            }
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <span
                        className={`inline-flex w-fit px-3 py-1 text-[10px] uppercase tracking-[0.12em] ${getStatusClass(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </span>
                    </div>

                    {/* ==================================================
                        REVIEW CONTENT
                    ================================================== */}

                    <div className="mt-6 border-t border-neutral-100 pt-5">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* STARS */}
                        <Stars
                          rating={
                            review.rating
                          }
                        />

                        {/* VERIFIED */}
                        {review.verifiedPurchase && (
                          <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                            ✓ Verified Purchase
                          </span>
                        )}

                        {/* DATE */}
                        <span className="text-xs text-neutral-400">
                          {formatDate(
                            review.createdAt
                          )}
                        </span>
                      </div>

                      {/* TITLE */}
                      {review.title && (
                        <h3 className="mt-4 text-sm font-medium">
                          {review.title}
                        </h3>
                      )}

                      {/* COMMENT */}
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
                        {review.comment ||
                          ""}
                      </p>
                    </div>

                    {/* ==================================================
                        CUSTOMER
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-1 border-t border-neutral-100 pt-5">
                      <p className="text-sm font-medium">
                        {review.customerName ||
                          review.user.name ||
                          "Customer"}
                      </p>

                      <p className="text-xs text-neutral-400">
                        {
                          review.user
                            .email
                        }
                      </p>
                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-100 pt-5">
                      {/* APPROVE */}
                      {review.status !==
                        "APPROVED" && (
                        <button
                          type="button"
                          disabled={
                            loadingId ===
                            review.id
                          }
                          onClick={() =>
                            updateReview(
                              review.id,
                              "APPROVE"
                            )
                          }
                          className="bg-black px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                        >
                          {loadingId ===
                          review.id
                            ? "Updating..."
                            : "Approve"}
                        </button>
                      )}

                      {/* REJECT */}
                      {review.status !==
                        "REJECTED" && (
                        <button
                          type="button"
                          disabled={
                            loadingId ===
                            review.id
                          }
                          onClick={() =>
                            updateReview(
                              review.id,
                              "REJECT"
                            )
                          }
                          className="border border-neutral-300 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-neutral-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:bg-neutral-100"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}