"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { Brand } from "@prisma/client";


// ============================================================
// PROPS
// ============================================================

type BrandFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<void>;

  brand?: Brand;

  submitText: string;
};


// ============================================================
// SLUG
// ============================================================

function generateSlug(
  text: string
) {
  return text
    .toLowerCase()
    .trim()
    .replace(
      /['"]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}


// ============================================================
// COMPONENT
// ============================================================

export default function BrandForm({
  action,
  brand,
  submitText,
}: BrandFormProps) {

  const [
    name,
    setName,
  ] = useState(
    brand?.name ?? ""
  );


  const [
    slug,
    setSlug,
  ] = useState(
    brand?.slug ?? ""
  );


  const slugEdited =
    useRef(
      Boolean(
        brand?.slug
      )
    );


  // ==========================================================
  // AUTO SLUG
  // ==========================================================

  useEffect(() => {

    if (
      !slugEdited.current
    ) {

      setSlug(
        generateSlug(
          name
        )
      );

    }

  }, [
    name,
  ]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <form
      action={action}
      className="
        space-y-5
        sm:space-y-6
      "
    >

      {/* ================================================== */}
      {/* BRAND NAME */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="name"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Brand Name
        </label>


        <input
          id="name"
          name="name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="e.g. Louis Vuitton"
          className="
            h-11
            w-full
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-neutral-400
            focus:ring-2
            focus:ring-neutral-100

            sm:px-4
          "
          required
        />

      </div>


      {/* ================================================== */}
      {/* SLUG */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="slug"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Slug
        </label>


        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {

            slugEdited.current =
              true;

            setSlug(
              e.target.value
            );

          }}
          placeholder="e.g. louis-vuitton"
          className="
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-neutral-400
            focus:ring-2
            focus:ring-neutral-100

            sm:px-4
          "
          required
        />

      </div>


      {/* ================================================== */}
      {/* STATUS */}
      {/* ================================================== */}

      <div
        className="
          rounded-xl
          border
          border-neutral-200
          bg-neutral-50
          p-3
          sm:p-4
        "
      >

        <label
          htmlFor="active"
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            font-medium
            text-neutral-800
          "
        >

          <input
            id="active"
            type="checkbox"
            name="active"
            defaultChecked={
              brand?.active ?? true
            }
            className="
              h-4
              w-4
              shrink-0
              rounded
              border-neutral-300
            "
          />

          <span>
            Active Brand
          </span>

        </label>

      </div>


      {/* ================================================== */}
      {/* SUBMIT */}
      {/* ================================================== */}

      <button
        type="submit"
        className="
          inline-flex
          min-h-11
          w-full
          items-center
          justify-center
          rounded-xl
          bg-black
          px-6
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:bg-neutral-800

          sm:w-auto
        "
      >
        {submitText}
      </button>

    </form>

  );

}