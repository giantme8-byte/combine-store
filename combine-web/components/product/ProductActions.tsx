import WishlistButton from "@/components/WishlistButton";
import AddToInquiryButton from "@/components/AddToInquiryButton";

type ProductActionsProps = {
  productId: number;
  whatsappLink: string;
};

export default function ProductActions({
  productId,
  whatsappLink,
}: ProductActionsProps) {
  return (
    <div className="mt-14 space-y-5">

      {/* Main Actions */}
      <div className="flex flex-wrap gap-4">

        <AddToInquiryButton
          productId={productId}
        />

        <WishlistButton
          productId={productId}
        />

      </div>


      {/* WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-full
          bg-black
          px-8
          py-5
          text-sm
          uppercase
          tracking-[0.25em]
          text-white
          transition
          duration-300
          hover:bg-neutral-800
        "
      >
        Inquire via WhatsApp →
      </a>


    </div>
  );
}