import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        saved: false,
      });
    }


    const { searchParams } = new URL(request.url);


    const productId = Number(
      searchParams.get("productId")
    );


    if (!productId) {
      return NextResponse.json(
        {
          saved: false,
          message: "Invalid product.",
        },
        {
          status: 400,
        }
      );
    }


    const item =
      await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });


    return NextResponse.json({
      saved: !!item,
    });


  } catch (error) {
    console.error(
      "Wishlist GET error:",
      error
    );

    return NextResponse.json(
      {
        saved: false,
      },
      {
        status: 500,
      }
    );
  }
}



export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();


    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        {
          status: 401,
        }
      );
    }


    const body = await request.json();

    const productId = Number(
      body.productId
    );


    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product.",
        },
        {
          status: 400,
        }
      );
    }



    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });



    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }



    const existing =
      await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });



    // Remove wishlist
    if (existing) {
      await prisma.wishlistItem.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });


      return NextResponse.json({
        success: true,
        saved: false,
      });
    }



    // Add wishlist
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
    });


    return NextResponse.json({
      success: true,
      saved: true,
    });


  } catch (error) {
    console.error(
      "Wishlist POST error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}