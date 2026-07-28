import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

const folder =
  (formData.get("folder") as string)?.trim() ||
  "gallery";

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

const result = await new Promise<UploadApiResponse>(
  (resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `combine-store/${folder}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Cloudinary upload returned no result."));
        }
      }
    ).end(buffer);
  }
);

return NextResponse.json({
  url: result.secure_url,
  publicId: result.public_id,
});
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}