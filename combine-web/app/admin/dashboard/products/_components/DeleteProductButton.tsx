"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteProduct } from "../_actions/product.actions";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "../../_components/Button";

type DeleteProductButtonProps = {
  productId: number;
  productName: string;
};

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProduct(productId);

        setOpen(false);

        router.refresh();
      } catch (error) {
        console.error(error);
        alert("Failed to delete product.");
      }
    });
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>

      <ConfirmDialog
        open={open}
        title="Delete Product"
        description={
          <>
            Are you sure you want to permanently delete
            <br />
            <strong>{productName}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </>
        }
        onCancel={() => {
          if (!isPending) {
            setOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}