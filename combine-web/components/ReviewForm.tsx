"use client";

import { useState } from "react";

type ReviewFormProps = {
  orderItemId: number;
  productName?: string;
  onSuccess?: () => void;
};

export default function ReviewForm({
  orderItemId,
  productName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!comment.trim()) {
      setError("Please write a review.");
      return;
    }

    if (comment.trim().length > 2000) {
      setError("Review is too long.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderItemId,
            rating,
            title: title.trim(),
            comment: comment.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Unable to submit your review."
        );
        return;
      }

      setMessage(
        "Thank you! Your review has been submitted and is awaiting approval."
      );

      setTitle("");
      setComment("");
      setRating(5);

      onSuccess?.();
    } catch (error) {
      console.error(
        "SUBMIT REVIEW ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const displayedRating =
    hoverRating || rating;

  return (
    <div className="mt-6 border border-neutral-200 bg-white p-6">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
          Verified Purchase
        </p>

        <h3 className="mt-2 text-lg font-medium">
          Write a Review
        </h3>

        {productName && (
          <p className="mt-1 text-sm text-neutral-500">
            {productName}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* RATING */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-[0.12em]">
            Rating
          </label>

          <div
            className="mt-3 flex items-center gap-1"
            onMouseLeave={() =>
              setHoverRating(0)
            }
          >
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${
                    star > 1 ? "s" : ""
                  }`}
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onClick={() =>
                    setRating(star)
                  }
                  className="text-2xl leading-none transition-transform hover:scale-110"
                >
                  <span
                    className={
                      star <=
                      displayedRating
                        ? "text-black"
                        : "text-neutral-300"
                    }
                  >
                    ★
                  </span>
                </button>
              )
            )}

            <span className="ml-2 text-xs text-neutral-500">
              {displayedRating}/5
            </span>
          </div>
        </div>

        {/* TITLE */}
        <div>
          <label
            htmlFor={`review-title-${orderItemId}`}
            className="block text-xs font-medium uppercase tracking-[0.12em]"
          >
            Review Title
            <span className="ml-1 font-normal text-neutral-400">
              (Optional)
            </span>
          </label>

          <input
            id={`review-title-${orderItemId}`}
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            maxLength={150}
            placeholder="Give your review a title"
            className="mt-3 w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <div className="mt-1 text-right text-[10px] text-neutral-400">
            {title.length}/150
          </div>
        </div>

        {/* COMMENT */}
        <div>
          <label
            htmlFor={`review-comment-${orderItemId}`}
            className="block text-xs font-medium uppercase tracking-[0.12em]"
          >
            Your Review
          </label>

          <textarea
            id={`review-comment-${orderItemId}`}
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            maxLength={2000}
            rows={6}
            placeholder="Tell us about your experience with this product..."
            className="mt-3 w-full resize-none border border-neutral-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-black"
          />

          <div className="mt-1 text-right text-[10px] text-neutral-400">
            {comment.length}/2000
          </div>
        </div>

        {/* MESSAGE */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            {message}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={
            loading || !comment.trim()
          }
          className="w-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

        <p className="text-center text-[10px] leading-5 text-neutral-400">
          Your review will be checked before
          being published.
        </p>
      </form>
    </div>
  );
}