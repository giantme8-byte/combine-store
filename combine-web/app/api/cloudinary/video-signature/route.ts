import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/authorize";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireRole([
      UserRole.STAFF,
      UserRole.MANAGER,
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);

    const config =
      cloudinary.config();

    if (
      !config.cloud_name ||
      !config.api_key ||
      !config.api_secret
    ) {
      throw new Error(
        "Cloudinary is not configured correctly."
      );
    }

    const timestamp = Math.floor(
      Date.now() / 1000
    );

    const folder =
      "combine-luxe/product-videos";

    const signature =
      cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
        },
        config.api_secret
      );

    return NextResponse.json({
      cloudName:
        config.cloud_name,
      apiKey:
        config.api_key,
      timestamp,
      signature,
      folder,
    });
  } catch (error) {
    console.error(
      "Cloudinary video signature error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to prepare video upload.",
      },
      { status: 500 }
    );
  }
}
