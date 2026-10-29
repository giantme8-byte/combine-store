import { UserRole, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";
import ReviewsClient from "./_components/ReviewsClient";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.STAFF,
  ]);

  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      status: true,
      verifiedPurchase: true,
      customerName: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      product: {
        select: {
          id: true,
          name: true,
          brand: true,
          sku: true,
          images: true,
        },
      },

      orderItem: {
        select: {
          id: true,
          orderId: true,
          sku: true,
          color: true,
          variant: true,
          quantity: true,
          unitPrice: true,
        },
      },
    },
  });

  const serializedReviews = reviews.map(
    (review) => ({
      ...review,
      createdAt:
        review.createdAt.toISOString(),
    })
  );

  const summary = {
    total: reviews.length,

    pending: reviews.filter(
      (review) =>
        review.status ===
        ReviewStatus.PENDING
    ).length,

    approved: reviews.filter(
      (review) =>
        review.status ===
        ReviewStatus.APPROVED
    ).length,

    rejected: reviews.filter(
      (review) =>
        review.status ===
        ReviewStatus.REJECTED
    ).length,
  };

  return (
    <div className="min-h-full">
      <ReviewsClient
        initialReviews={serializedReviews}
        initialSummary={summary}
      />
    </div>
  );
}