"use client";

import { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";

type UploadDropzoneProps = {
  hasImages: boolean;
  onUpload: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function UploadDropzone({
  hasImages,
  onUpload,
}: UploadDropzoneProps) {
  return (
    <div>
      <label
        className="
          mb-3
          block
          text-sm
          font-semibold
          text-neutral-800
        "
      >
        Product Images
      </label>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onUpload}
      />

      {!hasImages ? (
        <label
          htmlFor="image-upload"
          className="
            flex
            aspect-square
            w-full
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-3xl
            border-2
            border-dashed
            border-neutral-300
            bg-neutral-50
            transition
            hover:border-black
            hover:bg-neutral-100
          "
        >
          <ImagePlus
            size={54}
            className="text-neutral-400"
          />

          <p className="mt-5 text-lg font-semibold">
            Upload Images
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            First image will be cover
          </p>
        </label>
      ) : (
        <label
          htmlFor="image-upload"
          className="
            flex
            h-28
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            border-neutral-300
            bg-neutral-50
            transition
            hover:border-black
            hover:bg-neutral-100
          "
        >
          <ImagePlus
            size={34}
            className="text-neutral-400"
          />

          <p className="font-semibold">
            Add More Images
          </p>
        </label>
      )}
    </div>
  );
}