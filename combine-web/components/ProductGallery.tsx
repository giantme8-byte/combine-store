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


  const images = Array.from(
    new Set([cover, ...gallery])
  );


  const [selectedImage, setSelectedImage] =
    useState(
      images[0] ?? "/placeholder.png"
    );

  const [lightboxOpen, setLightboxOpen] =
  useState(false);  

  const currentIndex = images.indexOf(selectedImage);

const touchStartX = useRef(0);
const touchEndX = useRef(0);
const isSwiping = useRef(false);

  const previousImage = () => {
  changeImage(currentIndex - 1);
};

const nextImage = () => {
  changeImage(currentIndex + 1);
};

function handleTouchStart(
  event: React.TouchEvent<HTMLDivElement>
) {
  isSwiping.current = false;

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
    isSwiping.current = true;
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
    When colour changes from ProductOptions,
    update gallery image automatically
  */
  useEffect(() => {
    if (
      selectedColor?.imageUrl
    ) {
      setSelectedImage(
        selectedColor.imageUrl
      );
    }
  }, [selectedColor]);

  useEffect(() => {
  if (selectedVariant?.imageUrl) {
    setSelectedImage(
      selectedVariant.imageUrl
    );
  }
}, [selectedVariant]);

useEffect(() => {
  function handleKeyDown(
    event: KeyboardEvent
  ) {
    if (lightboxOpen) return;

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
        changeImage(images.length - 1);
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


  const currentColor =
    colors.find(
      (color) =>
        color.imageUrl === selectedImage
    );


function handleColorChange(
  color: typeof colors[number]
) {
  setSelectedColor(color);

  const index = images.findIndex(
    (img) => img === color.imageUrl
  );

  if (index >= 0) {
    changeImage(index);
  } else {
    setSelectedImage(color.imageUrl);
  }
}

function changeImage(index: number) {
  const total = images.length;

  if (total === 0) return;

  const next =
    (index + total) % total;

  setSelectedImage(images[next]);
}


return (
  <>
    <div className="flex flex-col gap-6 lg:flex-row">


      {/* Thumbnails */}

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
onClick={() =>
  changeImage(index)
}
className={`overflow-hidden rounded-xl lg:rounded-2xl transition-all duration-300 ${
  selectedImage === img
    ? "scale-105 ring-2 ring-black shadow-md"
    : "ring-1 ring-neutral-200 hover:-translate-y-1 hover:ring-neutral-400"
}`}
            >
              <Image
                src={img}
                alt={`${name} ${index + 1}`}
                width={110}
                height={110}
                className="
h-14
w-14
lg:h-24
lg:w-24
                  bg-white
                  object-contain
p-2
lg:p-3
                  transition-transform
                  duration-300
                  hover:scale-105
                "
              />
            </button>
          )
        )}

      </div>



{/* Main */}
<div className="group relative flex-1">
  <div
    onClick={() => {
      if (!isSwiping.current) {
        setLightboxOpen(true);
      }
    }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    className="
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
    {/* Left Arrow */}
<button
  type="button"
  aria-label="Previous image"
      onClick={(event) => {
        event.stopPropagation();
        previousImage();
      }}
      className="
        absolute
        left-5
        top-1/2
        z-20
        hidden
        -translate-y-1/2
        rounded-full
        bg-white/80 backdrop-blur-md
        p-3
        text-black
        opacity-0
scale-95
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
hover:bg-white
        group-hover:scale-100
group-hover:opacity-100
        lg:flex
      "
    >
      <ChevronLeft size={22} />
    </button>

    {/* Image */}
    <div
      key={selectedImage}
      className="
        animate-[fadeSlide_.35s_ease]
      "
    >
      <ZoomImage
        src={selectedImage}
        alt={name}
      />
    </div>

    {/* Right Arrow */}
<button
  type="button"
  aria-label="Next image"
      onClick={(event) => {
        event.stopPropagation();
        nextImage();
      }}
      className="
        absolute
        right-5
        top-1/2
        z-20
        hidden
        -translate-y-1/2
        rounded-full
        bg-white/80 backdrop-blur-md
        p-3
        text-black
        opacity-0
scale-95
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
hover:bg-white
        group-hover:scale-100
group-hover:opacity-100
        lg:flex
      "
    >
      <ChevronRight size={22} />
    </button>
  </div>

  <div className="mt-5 flex items-center justify-between px-1">
    <span className="text-xs tracking-[0.25em] text-neutral-400">
      {currentIndex + 1} / {images.length}
    </span>

    <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
      IMAGE
    </span>
  </div>

  {/* Mobile Dot Indicator */}
  <div className="mt-5 flex justify-center gap-2 lg:hidden">
    {images.map((img, index) => (
      <button
        key={img}
        type="button"
        aria-label={`View image ${index + 1}`}
        onClick={() => changeImage(index)}
        className={`h-2 rounded-full transition-all duration-300 ease-out ${
          index === currentIndex
            ? "w-6 bg-black"
            : "w-2 bg-neutral-300"
        }`}
      />
    ))}
  </div>

  {/* Colour */}
  {colors.length > 0 && (
    <div className="mt-8 lg:mt-10">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
        Colour
      </p>

      <p className="mb-5 text-lg font-medium">
        {currentColor?.name ?? "Select Colour"}
      </p>

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => handleColorChange(color)}
            className={`group transition ${
              currentColor?.id === color.id
                ? "scale-105"
                : "hover:scale-105"
            }`}
          >
            <div
              className={`overflow-hidden rounded-full border-2 p-1 ${
                currentColor?.id === color.id
                  ? "border-black shadow-md"
                  : "border-neutral-300"
              }`}
            >
              <Image
                src={color.imageUrl}
                alt={color.name}
                width={60}
                height={60}
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
        ))}
      </div>
    </div>
  )}
</div>

</div>

<Lightbox
  open={lightboxOpen}
  images={images}
  image={selectedImage}
  name={name}
  onClose={() => setLightboxOpen(false)}
  onImageChange={(image) => {
    const index = images.indexOf(image);

    if (index >= 0) {
      changeImage(index);
    }
  }}
/>

</>
);
}