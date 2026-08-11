"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { optimizeCloudinaryImage } from "@/lib/cloudinary-image";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

export default function ZoomImage({
  src,
  alt,
  priority = false,
}: Props) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [position, setPosition] =
    useState({
      x: 50,
      y: 50,
    });

  const [zoom, setZoom] =
    useState(false);

  const [isDesktop, setIsDesktop] =
    useState(false);

  /*
   * Only enable hover zoom on desktop.
   */
  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(min-width: 1024px)"
      );

    function updateScreen() {
      setIsDesktop(
        mediaQuery.matches
      );
    }

    updateScreen();

    mediaQuery.addEventListener(
      "change",
      updateScreen
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateScreen
      );
    };
  }, []);

  /*
   * Mouse position for desktop zoom.
   */
  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (!isDesktop) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const rect =
      containerRef.current.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    setPosition({
      x,
      y,
    });
  }

  function handleMouseEnter() {
    if (!isDesktop) {
      return;
    }

    setZoom(true);
  }

  function handleMouseLeave() {
    if (!isDesktop) {
      return;
    }

    setZoom(false);

    setPosition({
      x: 50,
      y: 50,
    });
  }

  /*
   * Cloudinary optimization.
   *
   * The product detail main image is displayed
   * much larger than thumbnails, so use a larger
   * but still optimized image.
   */
  const optimizedSrc =
    optimizeCloudinaryImage(
      src,
      1200
    );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative
        aspect-square
        overflow-hidden
        rounded-2xl
        bg-white
        cursor-default
        lg:cursor-zoom-in
        lg:rounded-3xl
      "
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="
          (max-width: 640px) 100vw,
          (max-width: 1024px) 58vw,
          55vw
        "
        quality={82}
        className="
          object-contain
          p-6
          transition-transform
          duration-300
          md:p-8
          lg:p-12
        "
        style={{
          transformOrigin:
            `${position.x}% ${position.y}%`,

          transform:
            isDesktop && zoom
              ? "scale(1.65)"
              : "scale(1)",
        }}
      />
    </div>
  );
}