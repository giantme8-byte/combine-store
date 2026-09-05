"use client";

import {
  useState,
} from "react";

import {
  Trash2,
} from "lucide-react";

import {
  deleteInquiry,
} from "../_actions/inquiry.actions";


// ============================================================
// PROPS
// ============================================================

type DeleteInquiryButtonProps = {
  inquiryId: number;
  customerName: string;
  fullWidth?: boolean;
};


// ============================================================
// COMPONENT
// ============================================================

export default function DeleteInquiryButton({
  inquiryId,
  customerName,
  fullWidth = false,
}: DeleteInquiryButtonProps) {

  const [
    deleting,
    setDeleting,
  ] = useState(false);


  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete() {

    if (deleting) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete this inquiry from ${customerName}?\n\nThis action cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);


      await deleteInquiry(
        inquiryId
      );

    } catch (error) {

      console.error(
        "Failed to delete inquiry:",
        error
      );


      window.alert(
        "Failed to delete inquiry. Please try again."
      );


      setDeleting(false);

    }

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      title={
        deleting
          ? "Deleting..."
          : "Delete inquiry"
      }
      aria-label={
        deleting
          ? "Deleting inquiry"
          : "Delete inquiry"
      }
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-red-200
        text-red-500
        transition-all
        duration-200
        hover:border-red-300
        hover:bg-red-50
        hover:text-red-600
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          fullWidth
            ? "w-full px-5 py-3 text-xs font-medium"
            : "h-9 w-9"
        }
      `}
    >

      <Trash2
        size={16}
        strokeWidth={1.8}
      />

      {fullWidth && (
        <span>
          {deleting
            ? "Deleting..."
            : "Delete Inquiry"}
        </span>
      )}

    </button>

  );

}