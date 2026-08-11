"use client";

import Link from "next/link";

import Button from "../../_components/Button";
import DeleteProductButton from "./DeleteProductButton";
import DuplicateProductButton from "./DuplicateProductButton";

type ProductActionsProps = {
  productId: number;
  productName: string;
  canDelete: boolean;
};

export default function ProductActions({
  productId,
  productName,
  canDelete,
}: ProductActionsProps) {
  return (
    <div className="flex justify-end gap-2">

      {/* ================================================= */}
      {/* View */}
      {/* ================================================= */}

      <Link
        href={`/admin/dashboard/products/${productId}`}
      >
        <Button variant="secondary">
          View
        </Button>
      </Link>

      {/* ================================================= */}
      {/* Edit */}
      {/* ================================================= */}

      <Link
        href={`/admin/dashboard/products/${productId}/edit`}
      >
        <Button variant="secondary">
          Edit
        </Button>
      </Link>

      {/* ================================================= */}
      {/* Duplicate */}
      {/* ================================================= */}

      <DuplicateProductButton
        productId={productId}
      />

      {/* ================================================= */}
      {/* Delete */}
      {/* ================================================= */}

      {canDelete && (
        <DeleteProductButton
          productId={productId}
          productName={productName}
        />
      )}

    </div>
  );
}