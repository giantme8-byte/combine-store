import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type InquiryItemRequest = {
  productId: number;
  quantity: number;
};

type InquiryRequest = {
  name: string;
  whatsapp: string;
  email?: string;
  country?: string;
  message?: string;
  items: InquiryItemRequest[];
};

export async function POST(request: NextRequest) {
  try {
    const body: InquiryRequest = await request.json();

    const {
      name,
      whatsapp,
      email,
      country,
      message,
      items,
    } = body;

    if (!name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!whatsapp.trim()) {
      return NextResponse.json(
        { error: "WhatsApp is required." },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { error: "Inquiry is empty." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        whatsapp,
        email,
        country,
        message,

        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit inquiry.",
      },
      {
        status: 500,
      }
    );
  }
}