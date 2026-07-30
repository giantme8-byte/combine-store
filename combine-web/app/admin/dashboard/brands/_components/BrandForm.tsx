"use client";

import { useEffect, useRef, useState } from "react";
import type { Brand } from "@prisma/client";

type BrandFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  brand?: Brand;
  submitText: string;
};

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BrandForm({
  action,
  brand,
  submitText,
}: BrandFormProps) {
  const [name, setName] = useState(
    brand?.name ?? ""
  );

  const [slug, setSlug] = useState(
    brand?.slug ?? ""
  );

  const slugEdited = useRef(
    Boolean(brand?.slug)
  );

  useEffect(() => {
    if (!slugEdited.current) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  return (
    <form action={action} className="space-y-6">
      {/* Brand Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium"
        >
          Brand Name
        </label>

        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="e.g. Louis Vuitton"
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label
          htmlFor="slug"
          className="block text-sm font-medium"
        >
          Slug
        </label>

        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            slugEdited.current = true;
            setSlug(e.target.value);
          }}
          placeholder="e.g. louis-vuitton"
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="active"
          className="flex items-center gap-3"
        >
          <input
            id="active"
            type="checkbox"
            name="active"
            defaultChecked={
              brand?.active ?? true
            }
          />

          <span>Active Brand</span>
        </label>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
      >
        {submitText}
      </button>
    </form>
  );
}