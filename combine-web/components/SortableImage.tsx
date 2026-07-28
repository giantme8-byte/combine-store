"use client";

import Image from "next/image";
import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import {
  X,
} from "lucide-react";

import {
  ProductImageItem,
} from "@/types/product-image";


type Props = {
  image: ProductImageItem;

  index: number;

  onDelete: () => void;
};


export default function SortableImage({
  image,
  index,
  onDelete,
}: Props) {


  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: image.id,
  });


  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        relative
        aspect-square
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
        cursor-grab
      "
    >

      <Image
        src={image.url}
        alt={`Image ${index + 1}`}
        fill
        className="
          object-contain
          p-4
        "
      />


      <button
        type="button"
        onClick={(e)=>{
          e.stopPropagation();
          onDelete();
        }}
        className="
          absolute
          right-2
          top-2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-white
        "
      >
        <X size={16}/>
      </button>


    </div>
  );
}