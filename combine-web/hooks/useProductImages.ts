"use client";

import { useState } from "react";
import { ProductImageItem } from "@/types/product-image";

export function useProductImages(
  initialImages: ProductImageItem[] = []
) {
  const [images, setImages] =
    useState<ProductImageItem[]>(initialImages);


  function addImages(
    newImages: ProductImageItem[]
  ) {
    setImages((prev) => [
      ...prev,
      ...newImages,
    ]);
  }


  function removeImage(
    id: string
  ) {
    setImages((prev) =>
      prev.filter(
        (image) => image.id !== id
      )
    );
  }


  function moveLeft(
    id: string
  ) {
    setImages((prev) => {
      const index = prev.findIndex(
        (image) => image.id === id
      );

      if (index <= 0) {
        return prev;
      }

      const next = [...prev];

      [
        next[index - 1],
        next[index],
      ] = [
        next[index],
        next[index - 1],
      ];

      return next;
    });
  }


  function moveRight(
    id: string
  ) {
    setImages((prev) => {
      const index = prev.findIndex(
        (image) => image.id === id
      );

      if (
        index === -1 ||
        index >= prev.length - 1
      ) {
        return prev;
      }

      const next = [...prev];

      [
        next[index],
        next[index + 1],
      ] = [
        next[index + 1],
        next[index],
      ];

      return next;
    });
  }


  function replaceImages(
    newImages: ProductImageItem[]
  ) {
    setImages(newImages);
  }


  return {
    images,
    setImages,
    addImages,
    removeImage,
    moveLeft,
    moveRight,
    replaceImages,
  };
}