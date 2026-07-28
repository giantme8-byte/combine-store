"use client";

import type { Brand } from "@prisma/client";

type BrandFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  brand?: Brand;
  submitText: string;
};

export default function BrandForm({
  action,
  brand,
  submitText,
}: BrandFormProps) {
  return (
    <form action={action} className="space-y-6">
      {/* Brand Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Brand Name
        </label>

        <input
          name="name"
          defaultValue={brand?.name}
          placeholder="e.g. Louis Vuitton"
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Slug
        </label>

        <input
          name="slug"
          defaultValue={brand?.slug}
          placeholder="e.g. louis-vuitton"
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Status */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={brand?.active ?? true}
        />

        Active Brand
      </label>

      <button
        type="submit"
        className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
      >
        {submitText}
      </button>
    </form>
  );
}