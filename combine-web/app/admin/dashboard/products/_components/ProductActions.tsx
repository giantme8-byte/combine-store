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

      <Link
        href={`/admin/dashboard/products/${productId}`}
      >
        <Button variant="secondary">
          View
        </Button>
      </Link>


      <Link
        href={`/admin/dashboard/products/${productId}/edit`}
      >
        <Button variant="secondary">
          Edit
        </Button>
      </Link>


      <DuplicateProductButton
        productId={productId}
      />


      {canDelete && (
        <DeleteProductButton
          productId={productId}
          productName={productName}
        />
      )}

    </div>
  );
}