"use client";

import {
  useEffect,
} from "react";

import Image from "next/image";

import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  optimizeCloudinaryImage,
} from "@/lib/cloudinary-image";

type Props = {
  open: boolean;
  images: string[];
  image: string;
  name: string;
  onClose: () => void;
  onImageChange: (
    image: string
  ) => void;
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
    images.length > 0
      ? images[
          (currentIndex -
            1 +
            images.length) %
            images.length
        ]
      : image;

  const nextImage =
    images.length > 0
      ? images[
          (currentIndex + 1) %
            images.length
        ]
      : image;

  /*
   * Optimized main image.
   *
   * Lightbox needs a larger image than
   * the Product Gallery, but there is
   * no reason to download the original
   * full-resolution file.
   */
  const optimizedMainImage =
    optimizeCloudinaryImage(
      image,
      1800
    );

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;

        case "ArrowLeft":
          event.preventDefault();

          if (previousImage) {
            onImageChange(
              previousImage
            );
          }

          break;

        case "ArrowRight":
          event.preventDefault();

          if (nextImage) {
            onImageChange(
              nextImage
            );
          }

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
    previousImage,
    nextImage,
    onClose,
    onImageChange,
  ]);

  /*
   * Lock body scrolling while
   * Lightbox is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

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
        p-4
        backdrop-blur-sm
        sm:p-6
      "
      onClick={onClose}
    >
      {/* ================================================= */}
      {/* Close */}
      {/* ================================================= */}

      <button
        type="button"
        aria-label="Close image viewer"
        onClick={onClose}
        className="
          absolute
          right-4
          top-4
          z-30
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/10
          text-white
          backdrop-blur-md
          transition-all
          duration-300
          hover:scale-105
          hover:bg-white/20
          sm:right-8
          sm:top-8
          sm:h-12
          sm:w-12
        "
      >
        <X
          size={26}
          strokeWidth={1.8}
        />
      </button>

      {/* ================================================= */}
      {/* Content */}
      {/* ================================================= */}

      <div
        className="
          relative
          flex
          w-full
          max-w-[1800px]
          flex-col
          items-center
          gap-5
          sm:gap-8
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* Main Image */}
        {/* ================================================= */}

        <div
          className="
            relative
            flex
            w-full
            items-center
            justify-center
          "
        >

          {/* ================================================= */}
          {/* Previous */}
          {/* ================================================= */}

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={() =>
                onImageChange(
                  previousImage
                )
              }
              className="
                absolute
                left-1
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-110
                hover:bg-white/20
                active:scale-95
                sm:left-3
                sm:h-12
                sm:w-12
                lg:left-5
                lg:h-14
                lg:w-14
              "
            >
              <ChevronLeft
                size={26}
                strokeWidth={1.6}
              />
            </button>
          )}

          {/* ================================================= */}
          {/* Main Image */}
          {/* ================================================= */}

          <Image
            key={image}
            src={optimizedMainImage}
            alt={name}
            width={1800}
            height={1800}
            priority
            quality={85}
            sizes="
              (max-width: 640px) 92vw,
              (max-width: 1024px) 86vw,
              82vw
            "
            className="
              max-h-[72vh]
              max-w-[82vw]
              rounded-xl
              object-contain
              sm:max-h-[78vh]
              sm:max-w-[86vw]
              sm:rounded-2xl
            "
          />

          {/* ================================================= */}
          {/* Next */}
          {/* ================================================= */}

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={() =>
                onImageChange(
                  nextImage
                )
              }
              className="
                absolute
                right-1
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-110
                hover:bg-white/20
                active:scale-95
                sm:right-3
                sm:h-12
                sm:w-12
                lg:right-5
                lg:h-14
                lg:w-14
              "
            >
              <ChevronRight
                size={26}
                strokeWidth={1.6}
              />
            </button>
          )}

        </div>

        {/* ================================================= */}
        {/* Counter */}
        {/* ================================================= */}

        {images.length > 1 && (
          <div
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/60
            "
          >
            {currentIndex + 1} /{" "}
            {images.length}
          </div>
        )}

        {/* ================================================= */}
        {/* Thumbnails */}
        {/* ================================================= */}

        {images.length > 1 && (
          <div
            className="
              flex
              max-w-full
              gap-2
              overflow-x-auto
              px-2
              pb-2
              sm:gap-3
            "
          >
            {images.map(
              (img, index) => {
                const optimizedThumbnail =
                  optimizeCloudinaryImage(
                    img,
                    160
                  );

                return (
                  <button
                    key={img}
                    type="button"
                    aria-label={`View image ${
                      index + 1
                    }`}
                    onClick={() =>
                      onImageChange(
                        img
                      )
                    }
                    className={`
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      transition-all
                      duration-300
                      sm:rounded-xl
                      ${
                        img === image
                          ? "scale-105 ring-2 ring-white"
                          : "opacity-50 hover:opacity-100"
                      }
                    `}
                  >
                    <Image
                      src={
                        optimizedThumbnail
                      }
                      alt={`${name} ${
                        index + 1
                      }`}
                      width={72}
                      height={72}
                      loading="lazy"
                      sizes="64px"
                      quality={70}
                      className="
                        h-12
                        w-12
                        bg-white
                        object-contain
                        p-1
                        sm:h-16
                        sm:w-16
                      "
                    />
                  </button>
                );
              }
            )}
          </div>
        )}

      </div>
    </div>
  );
}