"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

type LogoUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function LogoUpload({
  value,
  onChange,
}: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "settings");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      onChange(data.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-700">
        Company Logo
      </label>

      {value ? (
        <div className="space-y-4">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border bg-white">
            <Image
              src={value}
              alt="Company Logo"
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border px-4 py-2 transition hover:bg-neutral-100"
            >
              {uploading ? "Uploading..." : "Replace Logo"}
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-xl border border-red-300 px-4 py-2 text-red-600 transition hover:bg-red-50"
            >
              Remove Logo
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-neutral-800"
          >
            {uploading ? "Uploading..." : "Upload Logo"}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />
    </div>
  );
}