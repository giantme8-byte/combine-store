"use client";

import type { Category } from "@prisma/client";

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
  submitText: string;
};

export default function CategoryForm({
  action,
  category,
  submitText,
}: CategoryFormProps) {
  return (
    <form action={action} className="space-y-6">
      {/* Category Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Category Name
        </label>

        <input
          name="name"
          defaultValue={category?.name}
          placeholder="e.g. Bags"
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
          defaultValue={category?.slug}
          placeholder="e.g. bags"
          className="w-full rounded-lg border p-3"
          required
        />
      </div>

      {/* Status */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={category?.active ?? true}
        />

        Active Category
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