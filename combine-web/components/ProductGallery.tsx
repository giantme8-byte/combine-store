"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Lightbox from "@/components/Lightbox";
import ZoomImage from "@/components/ZoomImage";

import { useProduct } from "@/components/product/ProductContext";

import { optimizeCloudinaryImage } from "@/lib/cloudinary-image";

type Props = {
  cover: string;
  gallery: string[];
  colors: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
  name: string;
};

export default function ProductGallery({
  cover,
  gallery,
  colors,
  name,
}: Props) {
  const {
    selectedColor,
    setSelectedColor,
    selectedVariant,
  } = useProduct();

  /*
   * Remove duplicate images.
   */
  const images = Array.from(
    new Set([
      cover,
      ...gallery,
    ])
  );

  /*
   * Initial image.
   *
   * Only the first product image receives
   * priority loading.
   */
  const initialImage =
    images[0] ?? "/placeholder.png";

  /*
   * Selected image.
   */
  const [
    selectedImage,
    setSelectedImage,
  ] = useState(initialImage);

  /*
   * Lightbox.
   */
  const [
    lightboxOpen,
    setLightboxOpen,
  ] = useState(false);

  /*
   * Current image index.
   */
  const currentIndex = Math.max(
    0,
    images.indexOf(selectedImage)
  );

  /*
   * Swipe.
   */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  /*
   * Change image.
   */
  function changeImage(index: number) {
    const total = images.length;

    if (total === 0) {
      return;
    }

    const next =
      (index + total) % total;

    setSelectedImage(
      images[next]
    );
  }

  /*
   * Previous.
   */
  function previousImage() {
    changeImage(
      currentIndex - 1
    );
  }

  /*
   * Next.
   */
  function nextImage() {
    changeImage(
      currentIndex + 1
    );
  }

  /*
   * Touch start.
   */
  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    isSwiping.current = false;

    touchStartX.current =
      event.touches[0].clientX;

    touchEndX.current =
      touchStartX.current;
  }

  /*
   * Touch move.
   */
  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchEndX.current =
      event.touches[0].clientX;

    if (
      Math.abs(
        touchStartX.current -
          touchEndX.current
      ) > 10
    ) {
      isSwiping.current = true;
    }
  }

  /*
   * Touch end.
   */
  function handleTouchEnd() {
    const distance =
      touchStartX.current -
      touchEndX.current;

    if (distance > 60) {
      nextImage();
    }

    if (distance < -60) {
      previousImage();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  }

  /*
   * Colour change.
   */
  useEffect(() => {
    if (selectedColor?.imageUrl) {
      setSelectedImage(
        selectedColor.imageUrl
      );
    }
  }, [selectedColor]);

  /*
   * Variant change.
   */
  useEffect(() => {
    if (selectedVariant?.imageUrl) {
      setSelectedImage(
        selectedVariant.imageUrl
      );
    }
  }, [selectedVariant]);

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (lightboxOpen) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          previousImage();
          break;

        case "ArrowRight":
          nextImage();
          break;

        case "Home":
          changeImage(0);
          break;

        case "End":
          changeImage(
            images.length - 1
          );
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    currentIndex,
    images.length,
    lightboxOpen,
  ]);

  /*
   * Current colour.
   */
  const currentColor =
    colors.find(
      (color) =>
        color.imageUrl ===
        selectedImage
    );

  /*
   * Colour click.
   */
  function handleColorChange(
    color: typeof colors[number]
  ) {
    setSelectedColor(color);

    const index =
      images.findIndex(
        (img) =>
          img === color.imageUrl
      );

    if (index >= 0) {
      changeImage(index);
    } else {
      setSelectedImage(
        color.imageUrl
      );
    }
  }

  const hasMultipleImages =
    images.length > 1;

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* ================================================= */}
        {/* Thumbnails */}
        {/* ================================================= */}

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-2
            lg:flex-col
            lg:gap-4
            lg:overflow-visible
          "
        >
          {images.map(
            (img, index) => (
              <button
                key={img}
                type="button"
                aria-label={`View image ${
                  index + 1
                }`}
                onClick={() =>
                  changeImage(index)
                }
                className={`
                  overflow-hidden
                  rounded-xl
                  transition-all
                  duration-300
                  lg:rounded-2xl
                  ${
                    selectedImage === img
                      ? "scale-105 ring-2 ring-black shadow-md"
                      : "ring-1 ring-neutral-200 hover:-translate-y-1 hover:ring-neutral-400"
                  }
                `}
              >
                <Image
                  src={optimizeCloudinaryImage(
                    img,
                    240
                  )}
                  alt={`${name} ${
                    index + 1
                  }`}
                  width={110}
                  height={110}
                  loading={
                    index === 0
                      ? "eager"
                      : "lazy"
                  }
                  sizes="96px"
                  quality={75}
                  className="
                    h-14
                    w-14
                    bg-white
                    object-contain
                    p-2
                    transition-transform
                    duration-300
                    hover:scale-105
                    lg:h-24
                    lg:w-24
                    lg:p-3
                  "
                />
              </button>
            )
          )}
        </div>

        {/* ================================================= */}
        {/* Main Image */}
        {/* ================================================= */}

        <div className="group relative flex-1">

          <div
            onClick={() => {
              if (!isSwiping.current) {
                setLightboxOpen(true);
              }
            }}
            onTouchStart={
              handleTouchStart
            }
            onTouchMove={
              handleTouchMove
            }
            onTouchEnd={
              handleTouchEnd
            }
            className="
              relative
              touch-pan-y
              rounded-2xl
              border
              border-neutral-200
              bg-white
              shadow-lg
              transition-all
              duration-500
              hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)]
              lg:rounded-3xl
              lg:shadow-[0_20px_60px_rgba(0,0,0,0.05)]
            "
          >

            {/* ================================================= */}
            {/* Previous Arrow */}
            {/* ================================================= */}

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
                className="
                  absolute
                  left-3
                  top-1/2
                  z-30
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white/90
                  text-black
                  shadow-md
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-white
                  active:scale-95
                  sm:left-5
                  sm:h-12
                  sm:w-12
                "
              >
                <ChevronLeft
                  size={22}
                  strokeWidth={1.8}
                />
              </button>
            )}

            {/* ================================================= */}
            {/* Main Image */}
            {/* ================================================= */}

            <div
              key={selectedImage}
              className="
                animate-[fadeSlide_.35s_ease]
              "
            >
              <ZoomImage
                src={selectedImage}
                alt={name}
                priority={
                  selectedImage ===
                  initialImage
                }
              />
            </div>

            {/* ================================================= */}
            {/* Next Arrow */}
            {/* ================================================= */}

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="
                  absolute
                  right-3
                  top-1/2
                  z-30
                  flex
                  h-10
                  w-10
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white/90
                  text-black
                  shadow-md
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-white
                  active:scale-95
                  sm:right-5
                  sm:h-12
                  sm:w-12
                "
              >
                <ChevronRight
                  size={22}
                  strokeWidth={1.8}
                />
              </button>
            )}

          </div>

          {/* ================================================= */}
          {/* Image Counter */}
          {/* ================================================= */}

          <div className="mt-5 flex items-center justify-between px-1">
            <span className="text-xs tracking-[0.25em] text-neutral-400">
              {currentIndex + 1} /{" "}
              {images.length}
            </span>

            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              IMAGE
            </span>
          </div>

          {/* ================================================= */}
          {/* Mobile Swipe Hint */}
          {/* ================================================= */}

          {hasMultipleImages && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-neutral-400
                lg:hidden
              "
            >
              <ChevronLeft
                size={13}
                strokeWidth={1.5}
              />

              <span>
                Swipe to explore
              </span>

              <ChevronRight
                size={13}
                strokeWidth={1.5}
              />
            </div>
          )}

          {/* ================================================= */}
          {/* Mobile Dots */}
          {/* ================================================= */}

          {hasMultipleImages && (
            <div className="mt-4 flex justify-center gap-2 lg:hidden">
              {images.map(
                (img, index) => (
                  <button
                    key={img}
                    type="button"
                    aria-label={`View image ${
                      index + 1
                    }`}
                    onClick={() =>
                      changeImage(index)
                    }
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ease-out
                      ${
                        index ===
                        currentIndex
                          ? "w-6 bg-black"
                          : "w-2 bg-neutral-300"
                      }
                    `}
                  />
                )
              )}
            </div>
          )}

          {/* ================================================= */}
          {/* Colour */}
          {/* ================================================= */}

          {colors.length > 0 && (
            <div className="mt-8 lg:mt-10">

              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
                Colour
              </p>

              <p className="mb-5 text-lg font-medium">
                {currentColor?.name ??
                  "Select Colour"}
              </p>

              <div className="flex flex-wrap gap-4">

                {colors.map(
                  (color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() =>
                        handleColorChange(
                          color
                        )
                      }
                      className={`
                        group
                        transition
                        ${
                          currentColor?.id ===
                          color.id
                            ? "scale-105"
                            : "hover:scale-105"
                        }
                      `}
                    >

                      <div
                        className={`
                          overflow-hidden
                          rounded-full
                          border-2
                          p-1
                          ${
                            currentColor?.id ===
                            color.id
                              ? "border-black shadow-md"
                              : "border-neutral-300"
                          }
                        `}
                      >

                        <Image
                          src={optimizeCloudinaryImage(
                            color.imageUrl,
                            160
                          )}
                          alt={color.name}
                          width={60}
                          height={60}
                          loading="lazy"
                          sizes="56px"
                          quality={75}
                          className="
                            h-14
                            w-14
                            bg-white
                            object-contain
                          "
                        />

                      </div>

                      <p className="mt-2 text-center text-xs">
                        {color.name}
                      </p>

                    </button>
                  )
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================================================= */}
      {/* Lightbox */}
      {/* ================================================= */}

      <Lightbox
        open={lightboxOpen}
        images={images}
        image={selectedImage}
        name={name}
        onClose={() =>
          setLightboxOpen(false)
        }
        onImageChange={(image) => {
          const index =
            images.indexOf(image);

          if (index >= 0) {
            changeImage(index);
          }
        }}
      />
    </>
  );
}