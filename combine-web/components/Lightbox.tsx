"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  open: boolean;
  images: string[];
  image: string;
  name: string;
  onClose: () => void;
  onImageChange: (image: string) => void;
};

export default function Lightbox({
  open,
  images,
  image,
  name,
  onClose,
  onImageChange,
}: Props) {
  const currentIndex = Math.max(
    images.indexOf(image),
    0
  );

  const previousImage =
    images[
      (currentIndex - 1 + images.length) %
        images.length
    ];

  const nextImage =
    images[
      (currentIndex + 1) %
        images.length
    ];

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      switch (event.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowLeft":
          event.preventDefault();
          onImageChange(previousImage);
          break;

        case "ArrowRight":
          event.preventDefault();
          onImageChange(nextImage);
          break;

        default:
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    currentIndex,
    images,
    onClose,
    onImageChange,
    previousImage,
    nextImage,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/90
        backdrop-blur-sm
        p-6
      "
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="
          absolute
          right-8
          top-8
          z-20
          text-white
          transition
          hover:opacity-70
        "
      >
        <X size={34} />
      </button>

      {/* Content */}
      <div
        className="
          relative
          flex
          flex-col
          items-center
          gap-8
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <div className="relative">
          {/* Left */}
          <button
            type="button"
            onClick={() =>
              onImageChange(previousImage)
            }
            className="
              absolute
              left-[-70px]
              top-1/2
              -translate-y-1/2
              rounded-full
              bg-white/10
              p-4
              text-white
              backdrop-blur
              transition-all
              hover:bg-white/20
            "
          >
            <ChevronLeft size={34} />
          </button>

          <Image
            src={image}
            alt={name}
            width={1800}
            height={1800}
            className="
              max-h-[78vh]
              max-w-[86vw]
              rounded-2xl
              object-contain
            "
          />

          {/* Right */}
          <button
            type="button"
            onClick={() =>
              onImageChange(nextImage)
            }
            className="
              absolute
              right-[-70px]
              top-1/2
              -translate-y-1/2
              rounded-full
              bg-white/10
              p-4
              text-white
              backdrop-blur
              transition-all
              hover:bg-white/20
            "
          >
            <ChevronRight size={34} />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex flex-wrap justify-center gap-3">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() =>
                onImageChange(img)
              }
              className={`
                overflow-hidden
                rounded-xl
                transition-all
                ${
                  img === image
                    ? "scale-105 ring-2 ring-white"
                    : "opacity-60 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img}
                alt={`${name} ${index + 1}`}
                width={72}
                height={72}
                className="
                  h-16
                  w-16
                  bg-white
                  object-contain
                  p-1
                "
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}