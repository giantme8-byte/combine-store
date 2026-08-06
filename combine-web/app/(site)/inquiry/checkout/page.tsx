import InquiryCheckoutForm from "./_components/InquiryCheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-8 pb-32 pt-36 lg:px-12">
      <div className="mx-auto mb-24 max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          CHECKOUT
        </p>

        <h1
          className="
            mt-6
            text-5xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            md:text-6xl
          "
        >
          Complete Your Inquiry
        </h1>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Provide your contact details below and our team will
          prepare pricing, availability and shipping information
          for your selected luxury pieces.
        </p>
      </div>

      <InquiryCheckoutForm />
    </main>
  );
}