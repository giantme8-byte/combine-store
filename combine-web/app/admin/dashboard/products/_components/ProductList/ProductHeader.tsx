export default function ProductHeader() {
  return (
    <div
      className="
        grid
        grid-cols-[48px_120px_1fr_220px_180px_80px]
        items-center
        gap-6
        border-b
        border-neutral-200
        px-5
        pb-4
        text-xs
        font-semibold
        uppercase
        tracking-[0.18em]
        text-neutral-500
      "
    >
      <div></div>

      <div>Image</div>

      <div>Product</div>

      <div>Pricing</div>

      <div>Availability</div>

      <div className="text-right">
        Actions
      </div>
    </div>
  );
}