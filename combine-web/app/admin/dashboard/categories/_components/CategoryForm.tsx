"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@prisma/client";

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
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

export default function CategoryForm({
  action,
  category,
  submitText,
}: CategoryFormProps) {
  const [name, setName] = useState(
    category?.name ?? ""
  );

  const [slug, setSlug] = useState(
    category?.slug ?? ""
  );

  const slugEdited = useRef(
    Boolean(category?.slug)
  );

  useEffect(() => {
    if (!slugEdited.current) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  return (
    <form action={action} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium"
        >
          Category Name
        </label>

        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="e.g. Bags"
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
          placeholder="e.g. bags"
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
              category?.active ?? true
            }
          />

          <span>Active Category</span>
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