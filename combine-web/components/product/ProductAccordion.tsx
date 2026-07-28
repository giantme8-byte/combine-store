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
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-xs uppercase tracking-[0.35em] text-neutral-700">
          {title}
        </span>

        <span className="text-xl font-light text-neutral-500">
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          open
            ? "grid-rows-[1fr] pb-6 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="leading-8 whitespace-pre-line text-neutral-600">
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
    <div className="mt-20">
      <AccordionItem
        title="Description"
        defaultOpen
      >
        {description}
      </AccordionItem>

      <AccordionItem title="Shipping & Delivery">
        All items are carefully prepared upon order.

        {"\n\n"}

        Estimated delivery time is approximately 7–10 business days,
        depending on destination and customs clearance.

        {"\n\n"}

        Please contact us via WhatsApp for the latest availability before
        placing your inquiry.
      </AccordionItem>

      <AccordionItem title="Care Guide">
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