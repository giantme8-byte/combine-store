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
      await duplicateProduct(productId);
    });
  }

  return (
    <Button
      variant="secondary"
      onClick={handleDuplicate}
      disabled={isPending}
    >
      {isPending ? "Duplicating..." : "Duplicate"}
    </Button>
  );
}