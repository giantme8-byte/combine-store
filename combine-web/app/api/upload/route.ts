import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    const folder =
      (formData.get("folder") as string)?.trim() ||
      "gallery";

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Convert uploaded file to Buffer
     */
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /*
     * Upload to Cloudinary
     *
     * IMPORTANT:
     * We keep the original asset.
     *
     * Image optimization for customers will be handled
     * during delivery instead of permanently compressing
     * the original upload.
     */
    const result =
      await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: `combine-store/${folder}`,

              resource_type: "image",

              /*
               * Automatically remove unnecessary metadata
               * where supported by Cloudinary.
               */
              context: {
                uploaded_by: "combine",
              },
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              if (result) {
                resolve(result);
                return;
              }

              reject(
                new Error(
                  "Cloudinary upload returned no result."
                )
              );
            }
          ).end(buffer);
        }
      );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,

      /*
       * Useful information for future optimization
       * and debugging.
       */
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error(
      "Cloudinary upload error:",
      err
    );

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}