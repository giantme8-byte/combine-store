"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Lightbox from "@/components/Lightbox";
import ZoomImage from "@/components/ZoomImage";

import {
  useProduct,
} from "@/components/product/ProductContext";

import {
  optimizeCloudinaryImage,
} from "@/lib/cloudinary-image";

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
  model: string | null;
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
  } = useProduct();

  // ============================================================
  // BASE PRODUCT GALLERY
  // ============================================================

  const baseImages = useMemo(() => {
    return Array.from(
      new Set(
        [
          cover,
          ...gallery,
        ].filter(Boolean)
      )
    );
  }, [cover, gallery]);

  // ============================================================
  // ACTIVE COLOR
  // ============================================================

  const activeColor =
    colors.find(
      (color) =>
        color.id ===
        selectedColor?.id
    ) ?? null;

  // ============================================================
  // COLOR GALLERY
  // ============================================================

  const colorImages = useMemo(() => {
    if (!activeColor) {
      return [];
    }

    return Array.from(
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

          activeColor.imageUrl ?? "",
        ].filter(Boolean)
      )
    );
  }, [activeColor]);

  // ============================================================
  // VARIANT GALLERY
  // ============================================================

  const variantImages = useMemo(() => {
    if (!selectedVariant) {
      return [];
    }

    return Array.from(
      new Set(
        [
          ...(selectedVariant.images ?? [])
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

          selectedVariant.imageUrl ?? "",
        ].filter(Boolean)
      )
    );
  }, [selectedVariant]);

  // ============================================================
  // ACTIVE GALLERY
  // ============================================================

  const images = useMemo(() => {
    if (
      selectionSource ===
      "variant"
    ) {
      if (
        variantImages.length > 0
      ) {
        return variantImages;
      }

      if (
        colorImages.length > 0
      ) {
        return colorImages;
      }

      return baseImages;
    }

    if (
      colorImages.length > 0
    ) {
      return colorImages;
    }

    return baseImages;
  }, [
    selectionSource,
    variantImages,
    colorImages,
    baseImages,
  ]);

  // ============================================================
  // CURRENT IMAGE INDEX
  // ============================================================

  /*
   * IMPORTANT:
   *
   * The gallery is controlled by an INDEX,
   * not by the image URL.
   *
   * This prevents the main image from getting
   * stuck on the first image when the active
   * Variant gallery changes.
   */

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  // ============================================================
  // LIGHTBOX
  // ============================================================

  const [
    lightboxOpen,
    setLightboxOpen,
  ] = useState(false);

  // ============================================================
  // SELECTED IMAGE
  // ============================================================

  const selectedImage =
    images.length > 0
      ? images[
          Math.min(
            currentIndex,
            images.length - 1
          )
        ]
      : "/placeholder.png";

  // ============================================================
  // SWIPE
  // ============================================================

  const touchStartX =
    useRef(0);

  const touchEndX =
    useRef(0);

  const isSwiping =
    useRef(false);

  // ============================================================
  // CHANGE IMAGE
  // ============================================================

  function changeImage(
    index: number
  ) {
    const total =
      images.length;

    if (total === 0) {
      return;
    }

    const next =
      (index + total) % total;

    setCurrentIndex(next);
  }

  // ============================================================
  // PREVIOUS
  // ============================================================

  function previousImage() {
    changeImage(
      currentIndex - 1
    );
  }

  // ============================================================
  // NEXT
  // ============================================================

  function nextImage() {
    changeImage(
      currentIndex + 1
    );
  }

  // ============================================================
  // RESET IMAGE WHEN GALLERY CHANGES
  // ============================================================

  /*
   * When the user changes:
   *
   * Keepall 35
   *      ↓
   * Keepall 20
   *
   * the new Variant gallery should
   * always start from image #1.
   *
   * Same for Colour changes.
   */

  useEffect(() => {
    setCurrentIndex(0);
  }, [
    selectedVariant?.id,
    selectedColor?.id,
    selectionSource,
  ]);

  // ============================================================
  // SAFETY: KEEP INDEX INSIDE CURRENT GALLERY
  // ============================================================

  useEffect(() => {
    if (
      images.length === 0
    ) {
      setCurrentIndex(0);
      return;
    }

    if (
      currentIndex >=
      images.length
    ) {
      setCurrentIndex(
        images.length - 1
      );
    }
  }, [
    images.length,
    currentIndex,
  ]);

  // ============================================================
  // TOUCH START
  // ============================================================

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

  // ============================================================
  // TOUCH MOVE
  // ============================================================

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

  // ============================================================
  // TOUCH END
  // ============================================================

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

  // ============================================================
  // COLOUR CHANGE
  // ============================================================

  function handleColorChange(
    color: ProductGalleryColor
  ) {
    setSelectedColor({
      id: color.id,

      name: color.name,

      imageUrl:
        color.imageUrl ?? null,

      model:
        color.model ?? null,

      images:
        color.images ?? [],
    });
  }

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================

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

  // ============================================================
  // CURRENT COLOUR
  // ============================================================

  const currentColor =
    colors.find(
      (color) =>
        color.id ===
        selectedColor?.id
    ) ?? null;

  const hasMultipleImages =
    images.length > 1;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row">

        {/* ==================================================== */}
        {/* THUMBNAILS */}
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
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  transition-all
                  duration-300
                  lg:rounded-2xl

                  ${
                    currentIndex ===
                    index
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
                    object-cover
                    transition-transform
                    duration-300
                    hover:scale-105
                    lg:h-24
                    lg:w-24
                  "
                />
              </button>
            )
          )}
        </div>

        {/* ==================================================== */}
        {/* MAIN IMAGE */}
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

            {/* ================================================= */}
            {/* PREVIOUS */}
            {/* ================================================= */}

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
                  strokeWidth={1.8}
                />
              </button>
            )}

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div>
              <ZoomImage
                /*
                 * Force ZoomImage to receive a
                 * completely new instance whenever
                 * the selected image changes.
                 *
                 * This prevents the previous image
                 * from visually sticking.
                 */
                key={`${selectedImage}-${currentIndex}`}
                src={
                  selectedImage
                }
                alt={name}
                priority={
                  currentIndex === 0
                }
              />
            </div>

            {/* ================================================= */}
            {/* NEXT */}
            {/* ================================================= */}

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
                  strokeWidth={1.8}
                />
              </button>
            )}

          </div>

          {/* ==================================================== */}
          {/* COUNTER */}
          {/* ==================================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              px-1
            "
          >
            <span
              className="
                text-xs
                tracking-[0.25em]
                text-neutral-400
              "
            >
              {images.length > 0
                ? currentIndex + 1
                : 0}{" "}
              /{" "}
              {images.length}
            </span>

            <span
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              "
            >
              IMAGE
            </span>
          </div>

          {/* ==================================================== */}
          {/* MOBILE SWIPE HINT */}
          {/* ==================================================== */}

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

          {/* ==================================================== */}
          {/* MOBILE DOTS */}
          {/* ==================================================== */}

          {hasMultipleImages && (
            <div
              className="
                mt-4
                flex
                justify-center
                gap-2
                lg:hidden
              "
            >
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

          {/* ==================================================== */}
          {/* COLOUR SELECTOR */}
          {/* ==================================================== */}

          {colors.length > 0 && (
            <div
              className="
                mt-8
                lg:mt-10
              "
            >
              <p
                className="
                  mb-2
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-neutral-500
                "
              >
                Colour
              </p>

              <p
                className="
                  mb-5
                  text-lg
                  font-medium
                "
              >
                {currentColor?.name ??
                  "Select Colour"}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                "
              >
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

                        <p
                          className="
                            mt-2
                            text-center
                            text-xs
                          "
                        >
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

      {/* ====================================================== */}
      {/* LIGHTBOX */}
      {/* ====================================================== */}

      <Lightbox
        open={
          lightboxOpen
        }
        images={
          images
        }
        image={
          selectedImage
        }
        name={
          name
        }
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

          if (
            index >= 0
          ) {
            changeImage(
              index
            );
          }
        }}
      />
    </>
  );
}