"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  cover: string;
  gallery: string[];
  name: string;
};

export default function ProductGallery({
  cover,
  gallery,
  name,
}: Props) {
  const images = Array.from(new Set([cover, ...gallery]));

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse gap-8 lg:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto lg:flex-col lg:overflow-visible">
        {images.map((img, index) => (
          <button
            key={img}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={`overflow-hidden rounded-2xl transition-all duration-300 ${
              selectedImage === img
                ? "scale-105 ring-2 ring-black shadow-xl"
                : "ring-1 ring-neutral-200 hover:-translate-y-1 hover:ring-neutral-400"
            }`}
          >
            <Image
              src={img}
              alt={`${name} ${index + 1}`}
              width={110}
              height={110}
              className="h-24 w-24 bg-white object-contain p-3 transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <div className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <Image
            key={selectedImage}
            src={selectedImage}
            alt={name}
            width={1200}
            height={1200}
            priority
            className="aspect-square w-full object-contain p-12 transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
      </div>
    </div>
  );
}