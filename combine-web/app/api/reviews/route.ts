import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { OrderStatus, ReviewStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to leave a review.",
        },
        { status: 401 }
      );
    }

    const userId = currentUser.id;

    const body = await request.json();

    const orderItemId = Number(body.orderItemId);
    const rating = Number(body.rating);

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (
      !Number.isInteger(orderItemId) ||
      orderItemId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order item.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5.",
        },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Please write a review.",
        },
        { status: 400 }
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Review is too long.",
        },
        { status: 400 }
      );
    }

    if (title.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Review title is too long.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // FIND PURCHASE
    // ----------------------------------------------------------

    const orderItem = await prisma.orderItem.findUnique({
      where: {
        id: orderItemId,
      },
      include: {
        order: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
          },
        },

        review: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Order item not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // VERIFY CUSTOMER OWNS THIS ORDER
    // ----------------------------------------------------------

    if (orderItem.order.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot review this purchase.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // ONLY COMPLETED ORDERS CAN REVIEW
    // ----------------------------------------------------------

    if (
      orderItem.order.status !==
      OrderStatus.COMPLETED
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only review products from completed orders.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // PREVENT DUPLICATE REVIEW
    // ----------------------------------------------------------

    if (orderItem.review) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reviewed this purchase.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------------------------
    // CUSTOMER DISPLAY NAME
    // ----------------------------------------------------------

    const customerName =
      currentUser.name?.trim() ||
      currentUser.email?.split("@")[0] ||
      "Customer";

    // ----------------------------------------------------------
    // CREATE REVIEW
    // ----------------------------------------------------------

    const review = await prisma.review.create({
      data: {
        userId,
        productId: orderItem.product.id,
        orderItemId,

        rating,

        title: title || null,
        comment,

        status: ReviewStatus.PENDING,

        verifiedPurchase: true,

        customerName,
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
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Thank you! Your review has been submitted and is awaiting approval.",

      review,
    });
  } catch (error) {
    console.error(
      "CREATE REVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit review.",
      },
      { status: 500 }
    );
  }
}