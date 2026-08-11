"use client";

import { useState } from "react";

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <div
      className="
        border-t
        border-neutral-200
      "
    >
      {/* ================================================= */}
      {/* Accordion Header */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          min-h-14
          w-full
          items-center
          justify-between
          gap-6
          rounded-sm
          py-4
          text-left
          transition-all
          duration-300
          hover:bg-neutral-50
          sm:min-h-0
          sm:py-6
        "
        aria-expanded={open}
      >
        <span
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-neutral-900
            sm:text-xs
            sm:tracking-[0.35em]
          "
        >
          {title}
        </span>

        <svg
          className={`
            h-4
            w-4
            shrink-0
            text-neutral-500
            transition-transform
            duration-500
            ease-in-out
            ${open ? "rotate-180" : ""}
          `}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>

      {/* ================================================= */}
      {/* Accordion Content */}
      {/* ================================================= */}

      <div
        className={`
          grid
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          ${
            open
              ? "grid-rows-[1fr] pb-5 opacity-100 sm:pb-6"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className="
              max-w-2xl
              whitespace-pre-line
              text-[14px]
              leading-7
              text-neutral-600
              sm:text-[15px]
              sm:leading-8
            "
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type ProductAccordionProps = {
  description: string;
};

export default function ProductAccordion({
  description,
}: ProductAccordionProps) {
  return (
    <div
      className="
        mt-10
        border-b
        border-neutral-200
        sm:mt-20
      "
    >
      {/* ================================================= */}
      {/* Description */}
      {/* ================================================= */}

      <AccordionItem
        title="Description"
        defaultOpen
      >
        {description}
      </AccordionItem>

      {/* ================================================= */}
      {/* Shipping */}
      {/* ================================================= */}

      <AccordionItem
        title="Shipping & Delivery"
      >
        All items are carefully prepared upon order.

        {"\n\n"}

        Estimated delivery time is approximately 7–10 business days,
        depending on destination and customs clearance.

        {"\n\n"}

        Please contact us via WhatsApp for the latest availability before
        placing your inquiry.
      </AccordionItem>

      {/* ================================================= */}
      {/* Care Guide */}
      {/* ================================================= */}

      <AccordionItem
        title="Care Guide"
      >
        Store in a cool and dry place.

        {"\n\n"}

        Avoid prolonged exposure to direct sunlight, moisture and excessive
        heat.

        {"\n\n"}

        Keep the item inside its dust bag when not in use to help preserve
        its appearance.
      </AccordionItem>
    </div>
  );
}