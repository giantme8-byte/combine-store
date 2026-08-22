import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

import type { UploadApiResponse } from "cloudinary";

import { getCurrentUser } from "@/lib/auth";

import { UserRole } from "@prisma/client";

// ============================================================
// ALLOWED FOLDERS
// ============================================================

const CUSTOMER_FOLDERS = [
  "avatars",
  "payment-proofs",
] as const;

const ADMIN_FOLDERS = [
  "products",
  "gallery",
  "colors",
] as const;

// ============================================================
// FILE LIMITS
// ============================================================

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

// ============================================================
// ADMIN ROLES
// ============================================================

const ADMIN_ROLES: UserRole[] = [
  UserRole.OWNER,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.STAFF,
];

// ============================================================
// POST
// ============================================================

export async function POST(
  req: Request
) {
  try {
    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to upload files.",
        },
        {
          status: 401,
        }
      );
    }

    // ========================================================
    // FORM DATA
    // ========================================================

    const formData =
      await req.formData();

    const file =
      formData.get("file") as File | null;

    const requestedFolder =
      formData.get("folder");

    const folder =
      typeof requestedFolder === "string"
        ? requestedFolder.trim()
        : "";

    // ========================================================
    // FILE REQUIRED
    // ========================================================

    if (!file) {
      return NextResponse.json(
        {
          error:
            "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // FOLDER REQUIRED
    // ========================================================

    if (!folder) {
      return NextResponse.json(
        {
          error:
            "Upload folder is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // FOLDER PERMISSION
    // ========================================================

    const isCustomerFolder =
      CUSTOMER_FOLDERS.includes(
        folder as (
          typeof CUSTOMER_FOLDERS
        )[number]
      );

    const isAdminFolder =
      ADMIN_FOLDERS.includes(
        folder as (
          typeof ADMIN_FOLDERS
        )[number]
      );

    // ========================================================
    // UNKNOWN FOLDER
    // ========================================================

    if (
      !isCustomerFolder &&
      !isAdminFolder
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid upload folder.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // ADMIN FOLDER PERMISSION
    // ========================================================

    if (isAdminFolder) {
      if (
        !ADMIN_ROLES.includes(
          user.role
        )
      ) {
        return NextResponse.json(
          {
            error:
              "You do not have permission to upload to this folder.",
          },
          {
            status: 403,
          }
        );
      }
    }

    // ========================================================
    // FILE TYPE
    // ========================================================

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (
          typeof ALLOWED_IMAGE_TYPES
        )[number]
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // FILE SIZE
    // ========================================================

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "File size must be smaller than 10MB.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // FILE EMPTY CHECK
    // ========================================================

    if (
      file.size <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Uploaded file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // CONVERT TO BUFFER
    // ========================================================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // ========================================================
    // CLOUDINARY UPLOAD
    // ========================================================

    const result =
      await new Promise<UploadApiResponse>(
        (
          resolve,
          reject
        ) => {
          cloudinary.uploader.upload_stream(
            {
              folder:
                `combine-store/${folder}`,

              resource_type:
                "image",

              context: {
                uploaded_by:
                  "combine",

                uploaded_user_id:
                  String(user.id),

                uploaded_folder:
                  folder,
              },
            },

            (
              error,
              result
            ) => {
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

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        url:
          result.secure_url,

        publicId:
          result.public_id,

        width:
          result.width,

        height:
          result.height,

        format:
          result.format,

        bytes:
          result.bytes,

        folder,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}