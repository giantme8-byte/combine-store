"use client";

export default function ProductCard() {
  return (
    <div
      className="
        grid
        grid-cols-[48px_120px_1fr_220px_180px_80px]
        items-center
        gap-6
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-5
        transition
        hover:border-neutral-300
        hover:shadow-md
      "
    >
      <div>☰</div>

      <div>Image</div>

      <div>Information</div>

      <div>Pricing</div>

      <div>Status</div>

      <div>•••</div>
    </div>
  );
}