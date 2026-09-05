"use client";

import { useTransition } from "react";

import Button from "../../_components/Button";
import { duplicateProduct } from "../_actions/product.actions";

type DuplicateProductButtonProps = {
  productId: number;
};

export default function DuplicateProductButton({
  productId,
}: DuplicateProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDuplicate() {
    startTransition(async () => {
      try {
        await duplicateProduct(productId);
      } catch (error) {
        console.error("Failed to duplicate product:", error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleDuplicate}
      disabled={isPending}
    >
      {isPending ? "Duplicating..." : "Duplicate"}
    </Button>
  );
}