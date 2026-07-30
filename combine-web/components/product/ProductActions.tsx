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
    <div className="mt-6">
      <div className="border-t border-neutral-200 pt-8">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-neutral-400">
          Contact Us
        </p>

        {/* Primary CTA */}
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
            font-medium
            uppercase
            tracking-[0.22em]
            text-white
            transition
            duration-300
            hover:bg-neutral-800
          "
        >
          WhatsApp Inquiry →
        </a>

        {/* Secondary Actions */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <AddToInquiryButton
            productId={productId}
          />

          <WishlistButton
            productId={productId}
          />
        </div>
      </div>
    </div>
  );
}