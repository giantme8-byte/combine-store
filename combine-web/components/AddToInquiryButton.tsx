"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useInquiry } from "@/components/providers/InquiryProvider";

type Props = {
  productId: number;
};

export default function AddToInquiryButton({
  productId,
}: Props) {

  const {
    addItem,
    isInInquiry,
    getQuantity,
    openDrawer,
  } = useInquiry();


  const [loading, setLoading] = useState(false);


  const added = isInInquiry(productId);

  const quantity = getQuantity(productId);



  function handleAdd() {

    if (loading) return;


    setLoading(true);


    try {

      addItem(productId);

      openDrawer();

      toast.success(
        "Added to inquiry."
      );


    } catch (error) {

      console.error(
        "Failed to add inquiry:",
        error
      );

      toast.error(
        "Something went wrong."
      );


    } finally {

      setLoading(false);

    }

  }



  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={loading}
      className={`inline-flex min-w-[240px] items-center justify-center rounded-full border px-8 py-4 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? "border-green-600 bg-green-600 text-white"
          : "border-black text-black hover:bg-black hover:text-white"
      }`}
    >
      {loading
        ? "Adding..."
        : added
        ? `✓ Added (${quantity})`
        : "📋 Add to Inquiry"}
    </button>
  );
}