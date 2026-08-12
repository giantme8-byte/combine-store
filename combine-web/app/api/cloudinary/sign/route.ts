import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST() {
  try {
    const timestamp = Math.round(
      new Date().getTime() / 1000
    );

    const folder = "combine-store/gallery";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloudName:
        process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:
        process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error(
      "Cloudinary signature error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create upload signature",
      },
      {
        status: 500,
      }
    );
  }
}