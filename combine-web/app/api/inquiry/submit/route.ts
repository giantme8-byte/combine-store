import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


// ============================================================
// INQUIRY ITEM REQUEST
// ============================================================

type InquiryItemRequest = {
  productId: number;
  quantity: number;

  color?: string;
  variant?: string;
  dimensions?: string;
  packaging?: string;

  notes?: string;
};


// ============================================================
// INQUIRY REQUEST
// ============================================================

type InquiryRequest = {
  name: string;
  whatsapp: string;
  email?: string;
  country?: string;
  message?: string;
  items: InquiryItemRequest[];
};


// ============================================================
// POST
// ============================================================

export async function POST(
  request: NextRequest
) {

  try {

    const body: InquiryRequest =
      await request.json();


    // ========================================================
    // CURRENT CUSTOMER
    // ========================================================

    // Never trust a userId sent from the browser.
    // Always resolve the authenticated user
    // from the server-side session.

    const currentUser =
      await getCurrentUser();


    const userId =
      currentUser?.id ?? null;


    // ========================================================
    // CUSTOMER INFORMATION
    // ========================================================

    const {
      name,
      whatsapp,
      email,
      country,
      message,
      items,
    } = body;


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!name?.trim()) {

      return NextResponse.json(
        {
          error:
            "Name is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (!whatsapp?.trim()) {

      return NextResponse.json(
        {
          error:
            "WhatsApp is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Inquiry is empty.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // CREATE INQUIRY
    // ========================================================

    const inquiry =
      await prisma.inquiry.create({

        data: {

          name:
            name.trim(),

          whatsapp:
            whatsapp.trim(),

          email:
            email?.trim() || null,

          country:
            country?.trim() || null,

          message:
            message?.trim() || null,

          // ==================================================
          // CUSTOMER ACCOUNT
          // ==================================================

          // Logged-in Customer:
          // userId = current customer's ID
          //
          // Guest:
          // userId = null
          //
          // This allows both Customer Inquiry
          // and Guest Inquiry.

          userId,


          // ==================================================
          // INQUIRY ITEMS
          // ==================================================

          items: {

            create:
              items.map(
                (item) => ({

                  productId:
                    item.productId,

                  quantity:
                    item.quantity,

                  color:
                    item.color,

                  variant:
                    item.variant,

                  dimensions:
                    item.dimensions,

                  packaging:
                    item.packaging,

                  notes:
                    item.notes,

                })
              ),

          },

        },


        // ====================================================
        // INCLUDE ITEMS
        // ====================================================

        include: {

          items: true,

        },

      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {

        success:
          true,

        inquiry,

      }
    );


  } catch (error) {

    console.error(
      "Inquiry submission failed:",
      error
    );


    return NextResponse.json(
      {

        success:
          false,

        error:
          "Failed to submit inquiry.",

      },
      {

        status:
          500,

      }
    );

  }

}