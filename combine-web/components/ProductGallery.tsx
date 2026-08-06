"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
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


  const currentColor =
    colors.find(
      (color) =>
        color.imageUrl === selectedImage
    );


  function handleColorChange(
    color: typeof colors[number]
  ) {
    setSelectedColor(color);

    setSelectedImage(
      color.imageUrl
    );
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
                setSelectedImage(img)
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
      <div className="flex-1">
        <div
          onClick={() => setLightboxOpen(true)}
          className="
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
          <ZoomImage
            src={selectedImage}
            alt={name}
          />
        </div>

        {/* Mobile Dot Indicator */}
        <div className="mt-5 flex justify-center gap-2 lg:hidden">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              aria-label={`View image ${index + 1}`}
              onClick={() => setSelectedImage(img)}
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

              {colors.map(
                (color) => (

                  <button
                    key={color.id}
                    type="button"
                    onClick={() =>
                      handleColorChange(color)
                    }
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

                )
              )}

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
  onImageChange={setSelectedImage}
/>

  </>
);
}