import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ReviewStatus } from "@prisma/client";

// ============================================================
// REQUIRE ADMIN
// ============================================================

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Please log in.",
        },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

// ============================================================
// GET REVIEWS
// ============================================================

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const { searchParams } =
      new URL(request.url);

    const statusParam =
      searchParams.get("status");

    const status =
      statusParam &&
      Object.values(ReviewStatus).includes(
        statusParam as ReviewStatus
      )
        ? (statusParam as ReviewStatus)
        : undefined;

    const reviews =
      await prisma.review.findMany({
        where: {
          ...(status
            ? { status }
            : {}),
        },

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
          updatedAt: true,

          // --------------------------------------------------
          // CUSTOMER
          // --------------------------------------------------

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          // --------------------------------------------------
          // PRODUCT
          // --------------------------------------------------

          product: {
            select: {
              id: true,
              name: true,
              brand: true,
              sku: true,
              images: true,
            },
          },

          // --------------------------------------------------
          // ORDER ITEM
          // --------------------------------------------------

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

    // ========================================================
    // SUMMARY
    // ========================================================

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

    return NextResponse.json({
      success: true,
      summary,
      reviews,
    });
  } catch (error) {
    console.error(
      "ADMIN GET REVIEWS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load reviews.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// APPROVE / REJECT REVIEW
// ============================================================

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();

    const reviewId = Number(
      body.reviewId
    );

    const action =
      typeof body.action === "string"
        ? body.action
            .trim()
            .toUpperCase()
        : "";

    // ========================================================
    // VALIDATE REVIEW ID
    // ========================================================

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // VALIDATE ACTION
    // ========================================================

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review action.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // FIND REVIEW
    // ========================================================

    const existingReview =
      await prisma.review.findUnique({
        where: {
          id: reviewId,
        },

        select: {
          id: true,
          status: true,
        },
      });

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 }
      );
    }

    // ========================================================
    // NEW STATUS
    // ========================================================

    const newStatus =
      action === "APPROVE"
        ? ReviewStatus.APPROVED
        : ReviewStatus.REJECTED;

    // ========================================================
    // UPDATE REVIEW
    // ========================================================

    const review =
      await prisma.review.update({
        where: {
          id: reviewId,
        },

        data: {
          status: newStatus,
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
          updatedAt: true,
        },
      });

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,

      message:
        action === "APPROVE"
          ? "Review approved successfully."
          : "Review rejected successfully.",

      review,
    });
  } catch (error) {
    console.error(
      "ADMIN UPDATE REVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update review.",
      },
      { status: 500 }
    );
  }
}