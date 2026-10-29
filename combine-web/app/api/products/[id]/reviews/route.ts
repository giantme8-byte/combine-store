import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // ONLY SHOW APPROVED REVIEWS
    // ----------------------------------------------------------

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: ReviewStatus.APPROVED,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        verifiedPurchase: true,
        customerName: true,
        createdAt: true,
      },
    });

    // ----------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? Math.round(
            (totalRating / totalReviews) * 10
          ) / 10
        : 0;

    // ----------------------------------------------------------
    // RATING DISTRIBUTION
    // ----------------------------------------------------------

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    for (const review of reviews) {
      if (
        review.rating >= 1 &&
        review.rating <= 5
      ) {
        ratingDistribution[
          review.rating as
            | 1
            | 2
            | 3
            | 4
            | 5
        ]++;
      }
    }

    return NextResponse.json({
      success: true,

      summary: {
        averageRating,
        totalReviews,
        ratingDistribution,
      },

      reviews,
    });
  } catch (error) {
    console.error(
      "GET PRODUCT REVIEWS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load reviews.",
      },
      { status: 500 }
    );
  }
}