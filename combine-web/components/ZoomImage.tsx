"use client";

import {
  useRef,
  useState,
} from "react";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export default function ZoomImage({
  src,
  alt,
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

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (!containerRef.current) return;

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() =>
        setZoom(true)
      }
      onMouseLeave={() =>
        setZoom(false)
      }
className="
  relative
  aspect-square
  overflow-hidden
  rounded-2xl
  bg-white
  lg:rounded-3xl
  cursor-zoom-in
"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
className="
  object-contain
  p-6
  transition-transform
  duration-300
  md:p-8
  lg:p-12
"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
transform: zoom
  ? "scale(1.65)"
  : "scale(1)",
        }}
      />
    </div>
  );
}