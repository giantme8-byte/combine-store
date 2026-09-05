"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

type Props = {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
};

export default function ImagePreviewModal({
  open,
  src,
  alt = "Image preview",
  onClose,
}: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;

    setScale(1);
    setPosition({ x: 0, y: 0 });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function zoomIn() {
    setScale((value) => Math.min(4, Number((value + 0.25).toFixed(2))));
  }

  function zoomOut() {
    setScale((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))));
  }

  function reset() {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const delta = event.deltaY < 0 ? 0.2 : -0.2;

    setScale((value) =>
      Math.min(
        4,
        Math.max(0.5, Number((value + delta).toFixed(2)))
      )
    );
  }

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (scale <= 1) return;

    event.preventDefault();
    setDragging(true);
    setStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!dragging) return;

    setPosition({
      x: event.clientX - start.x,
      y: event.clientY - start.y,
    });
  }

  function handleMouseUp() {
    setDragging(false);
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] w-full max-w-7xl items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white"
          aria-label="Close preview"
        >
          <X size={20} />
        </button>

        <div className="absolute left-4 top-4 z-20 rounded-lg bg-black/60 px-3 py-2 text-xs text-white">
          {scale.toFixed(2)}×
          {scale > 1 && (
            <span className="ml-2 text-neutral-300">
              Drag to move
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white/95 p-1.5 shadow-xl">
          <button
            type="button"
            onClick={zoomOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100"
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>

          <button
            type="button"
            onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100"
            aria-label="Reset zoom"
          >
            <RotateCcw size={17} />
          </button>

          <button
            type="button"
            onClick={zoomIn}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-neutral-100"
            aria-label="Zoom in"
          >
            <Plus size={18} />
          </button>
        </div>

        <div
          className={`flex h-full w-full items-center justify-center select-none ${
            scale > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          onMouseDown={handleMouseDown}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-h-full max-w-full object-contain"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: dragging ? "none" : "transform 120ms ease-out",
            }}
          />
        </div>

        <div className="absolute bottom-4 right-4 z-20 hidden items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-xs text-white sm:flex">
          <Maximize2 size={14} />
          Scroll to zoom
        </div>
      </div>
    </div>
  );
}