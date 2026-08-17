"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Lightbox from "@/components/Lightbox";
import ZoomImage from "@/components/ZoomImage";

import {
  useProduct,
} from "@/components/product/ProductContext";

import { optimizeCloudinaryImage } from "@/lib/cloudinary-image";

type ColorGalleryImage = {
  id: number;
  url: string;
  publicId: string;
  sortOrder: number;
};

type ProductGalleryColor = {
  id: number;
  name: string;
  imageUrl: string | null;
  images: ColorGalleryImage[];
};

type Props = {
  cover: string;
  gallery: string[];
  colors: ProductGalleryColor[];
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

    selectionSource,
    setSelectionSource,
  } = useProduct();

  /*
   * ============================================================
   * BASE PRODUCT GALLERY
   * ============================================================
   */

  const baseImages = Array.from(
    new Set(
      [
        cover,
        ...gallery,
      ].filter(Boolean)
    )
  );

  /*
   * ============================================================
   * ACTIVE COLOR
   * ============================================================
   */

  const activeColor =
    colors.find(
      (color) =>
        color.id ===
        selectedColor?.id
    ) ?? null;

  /*
   * ============================================================
   * COLOR GALLERY
   * ============================================================
   */

  const colorImages =
    activeColor
      ? Array.from(
          new Set(
            [
              ...(activeColor.images ?? [])
                .slice()
                .sort(
                  (a, b) =>
                    a.sortOrder -
                    b.sortOrder
                )
                .map(
                  (image) =>
                    image.url
                ),

              activeColor.imageUrl ??
                "",
            ].filter(Boolean)
          )
        )
      : [];

  /*
   * ============================================================
   * VARIANT GALLERY
   * ============================================================
   *
   * Priority:
   *
   * 1. Variant images[]
   * 2. Legacy variant imageUrl
   */

  const variantImages =
    selectedVariant
      ? Array.from(
          new Set(
            [
              ...(selectedVariant.images ??
                [])
                .slice()
                .sort(
                  (a, b) =>
                    a.sortOrder -
                    b.sortOrder
                )
                .map(
                  (image) =>
                    image.url
                ),

              selectedVariant.imageUrl ??
                "",
            ].filter(Boolean)
          )
        )
      : [];

  /*
   * ============================================================
   * ACTIVE GALLERY
   * ============================================================
   *
   * Colour mode:
   *
   * Colour Gallery
   * → Product Gallery fallback
   *
   * Variant mode:
   *
   * Variant Gallery
   * → Colour Gallery fallback
   * → Product Gallery fallback
   */

  const images =
    selectionSource === "variant"
      ? variantImages.length > 0
        ? variantImages
        : colorImages.length > 0
        ? colorImages
        : baseImages
      : colorImages.length > 0
      ? colorImages
      : baseImages;

  /*
   * ============================================================
   * INITIAL IMAGE
   * ============================================================
   */

  const initialImage =
    images[0] ??
    "/placeholder.png";

  /*
   * ============================================================
   * SELECTED IMAGE
   * ============================================================
   */

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(
    initialImage
  );

  /*
   * ============================================================
   * LIGHTBOX
   * ============================================================
   */

  const [
    lightboxOpen,
    setLightboxOpen,
  ] = useState(false);

  /*
   * ============================================================
   * CURRENT IMAGE INDEX
   * ============================================================
   */

  const currentIndex = Math.max(
    0,
    images.indexOf(
      selectedImage
    )
  );

  /*
   * ============================================================
   * SWIPE
   * ============================================================
   */

  const touchStartX =
    useRef(0);

  const touchEndX =
    useRef(0);

  const isSwiping =
    useRef(false);

  /*
   * ============================================================
   * CHANGE IMAGE
   * ============================================================
   */

  function changeImage(
    index: number
  ) {
    const total =
      images.length;

    if (total === 0) {
      return;
    }

    const next =
      (index + total) %
      total;

    setSelectedImage(
      images[next]
    );
  }

  function previousImage() {
    changeImage(
      currentIndex - 1
    );
  }

  function nextImage() {
    changeImage(
      currentIndex + 1
    );
  }

  /*
   * ============================================================
   * TOUCH
   * ============================================================
   */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    isSwiping.current =
      false;

    touchStartX.current =
      event.touches[0].clientX;

    touchEndX.current =
      touchStartX.current;
  }

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
      isSwiping.current =
        true;
    }
  }

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
   * ============================================================
   * COLOUR CHANGE
   * ============================================================
   */

  function handleColorChange(
    color: ProductGalleryColor
  ) {
    setSelectionSource(
      "color"
    );

    setSelectedColor({
      id: color.id,
      name: color.name,
      imageUrl:
        color.imageUrl ?? "",
    });

    const selectedColorImages =
      Array.from(
        new Set(
          [
            ...(color.images ?? [])
              .slice()
              .sort(
                (a, b) =>
                  a.sortOrder -
                  b.sortOrder
              )
              .map(
                (image) =>
                  image.url
              ),

            color.imageUrl ??
              "",
          ].filter(Boolean)
        )
      );

    if (
      selectedColorImages.length >
      0
    ) {
      setSelectedImage(
        selectedColorImages[0]
      );

      return;
    }

    if (
      color.imageUrl
    ) {
      setSelectedImage(
        color.imageUrl
      );
    }
  }

  /*
   * ============================================================
   * COLOUR CHANGE EFFECT
   * ============================================================
   *
   * Only run this when Colour is the active gallery source.
   */

  useEffect(() => {
    if (
      selectionSource !==
      "color"
    ) {
      return;
    }

    const color =
      colors.find(
        (item) =>
          item.id ===
          selectedColor?.id
      ) ?? null;

    if (!color) {
      if (
        baseImages.length > 0
      ) {
        setSelectedImage(
          baseImages[0]
        );
      }

      return;
    }

    const selectedColorImages =
      Array.from(
        new Set(
          [
            ...(color.images ?? [])
              .slice()
              .sort(
                (a, b) =>
                  a.sortOrder -
                  b.sortOrder
              )
              .map(
                (image) =>
                  image.url
              ),

            color.imageUrl ??
              "",
          ].filter(Boolean)
        )
      );

    if (
      selectedColorImages.length >
      0
    ) {
      setSelectedImage(
        selectedColorImages[0]
      );

      return;
    }

    if (
      color.imageUrl
    ) {
      setSelectedImage(
        color.imageUrl
      );
    }
  }, [
    selectedColor,
    colors,
    selectionSource,
  ]);

  /*
   * ============================================================
   * VARIANT CHANGE EFFECT
   * ============================================================
   *
   * Only run this when Variant is the active gallery source.
   *
   * This is the important fix:
   *
   * Variant images[]
   * → complete Variant Gallery
   *
   * imageUrl
   * → legacy fallback
   */

  useEffect(() => {
    if (
      selectionSource !==
      "variant"
    ) {
      return;
    }

    if (!selectedVariant) {
      return;
    }

    const selectedVariantImages =
      Array.from(
        new Set(
          [
            ...(selectedVariant.images ??
              [])
              .slice()
              .sort(
                (a, b) =>
                  a.sortOrder -
                  b.sortOrder
              )
              .map(
                (image) =>
                  image.url
              ),

            selectedVariant.imageUrl ??
              "",
          ].filter(Boolean)
        )
      );

    if (
      selectedVariantImages.length >
      0
    ) {
      setSelectedImage(
        selectedVariantImages[0]
      );

      return;
    }

    /*
     * If Variant has no images,
     * fallback to current Colour Gallery.
     */

    if (
      colorImages.length > 0
    ) {
      setSelectedImage(
        colorImages[0]
      );

      return;
    }

    if (
      baseImages.length > 0
    ) {
      setSelectedImage(
        baseImages[0]
      );
    }
  }, [
    selectedVariant,
    selectionSource,
    colorImages,
    baseImages,
  ]);

  /*
   * ============================================================
   * ACTIVE GALLERY SYNC
   * ============================================================
   *
   * This handles cases where the image currently selected
   * no longer exists inside the new gallery.
   */

  useEffect(() => {
    if (
      images.length === 0
    ) {
      return;
    }

    if (
      !images.includes(
        selectedImage
      )
    ) {
      setSelectedImage(
        images[0]
      );
    }
  }, [
    images,
    selectedImage,
  ]);

  /*
   * ============================================================
   * KEYBOARD NAVIGATION
   * ============================================================
   */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (lightboxOpen) {
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previousImage();
        return;
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        nextImage();
        return;
      }

      if (
        event.key ===
        "Home"
      ) {
        changeImage(0);
        return;
      }

      if (
        event.key ===
        "End"
      ) {
        changeImage(
          images.length - 1
        );
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
   * ============================================================
   * CURRENT COLOUR
   * ============================================================
   */

  const currentColor =
    colors.find(
      (color) =>
        color.id ===
        selectedColor?.id
    ) ?? null;

  const hasMultipleImages =
    images.length > 1;

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ==================================================== */}
        {/* Thumbnails */}
        {/* ==================================================== */}

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
            (
              img,
              index
            ) => (
              <button
                key={`${img}-${index}`}
                type="button"
                aria-label={`View image ${
                  index + 1
                }`}
                onClick={() =>
                  changeImage(
                    index
                  )
                }
                className={`
                  overflow-hidden
                  rounded-xl
                  transition-all
                  duration-300
                  lg:rounded-2xl
                  ${
                    selectedImage ===
                    img
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

        {/* ==================================================== */}
        {/* Main Image */}
        {/* ==================================================== */}

        <div className="group relative flex-1">
          <div
            onClick={() => {
              if (
                !isSwiping.current
              ) {
                setLightboxOpen(
                  true
                );
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
            {/* Previous */}

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(
                  event
                ) => {
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
                  strokeWidth={
                    1.8
                  }
                />
              </button>
            )}

            {/* Image */}

            <div
              key={
                selectedImage
              }
              className="
                animate-[fadeSlide_.35s_ease]
              "
            >
              <ZoomImage
                src={
                  selectedImage
                }
                alt={name}
                priority={
                  selectedImage ===
                  initialImage
                }
              />
            </div>

            {/* Next */}

            {hasMultipleImages && (
              <button
                type="button"
                aria-label="Next image"
                onClick={(
                  event
                ) => {
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
                  strokeWidth={
                    1.8
                  }
                />
              </button>
            )}
          </div>

          {/* Counter */}

          <div className="mt-5 flex items-center justify-between px-1">
            <span className="text-xs tracking-[0.25em] text-neutral-400">
              {images.length >
              0
                ? currentIndex +
                  1
                : 0}{" "}
              /{" "}
              {images.length}
            </span>

            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
              IMAGE
            </span>
          </div>

          {/* Mobile Swipe Hint */}

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
                strokeWidth={
                  1.5
                }
              />

              <span>
                Swipe to explore
              </span>

              <ChevronRight
                size={13}
                strokeWidth={
                  1.5
                }
              />
            </div>
          )}

          {/* Mobile Dots */}

          {hasMultipleImages && (
            <div className="mt-4 flex justify-center gap-2 lg:hidden">
              {images.map(
                (
                  img,
                  index
                ) => (
                  <button
                    key={`${img}-dot-${index}`}
                    type="button"
                    aria-label={`View image ${
                      index + 1
                    }`}
                    onClick={() =>
                      changeImage(
                        index
                      )
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
          {/* Colour Selector */}
          {/* ================================================= */}

          {colors.length >
            0 && (
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
                  (
                    color
                  ) => {
                    const colorThumbnail =
                      color.imageUrl ??
                      color.images?.[0]
                        ?.url ??
                      "/placeholder.png";

                    return (
                      <button
                        key={
                          color.id
                        }
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
                              colorThumbnail,
                              160
                            )}
                            alt={
                              color.name
                            }
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
                          {
                            color.name
                          }
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* Lightbox */}
      {/* ==================================================== */}

      <Lightbox
        open={
          lightboxOpen
        }
        images={images}
        image={
          selectedImage
        }
        name={name}
        onClose={() =>
          setLightboxOpen(
            false
          )
        }
        onImageChange={(
          image
        ) => {
          const index =
            images.indexOf(
              image
            );

          if (index >= 0) {
            changeImage(
              index
            );
          }
        }}
      />
    </>
  );
}