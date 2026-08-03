"use client";

import { ChangeEvent } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  ProductImageItem,
} from "@/types/product-image";

import SortableImage from "@/components/SortableImage";

import UploadDropzone from "./UploadDropzone";

import GalleryGrid from "./GalleryGrid";

type ImageUploadProps = {
  images: ProductImageItem[];

  onChange: (
    images: ProductImageItem[]
  ) => void;
};



export default function ImageUpload({
  images,
  onChange,
}: ImageUploadProps) {


  const sensors = useSensors(
    useSensor(
      PointerSensor,
      {
        activationConstraint:{
          distance:8,
        },
      }
    )
  );

const visibleImages = images.filter(
  (image) => !image.deleted
);

  function handleUpload(
    e: ChangeEvent<HTMLInputElement>
  ){

    const files = Array.from(
      e.target.files ?? []
    );


    if(!files.length) return;



const newImages: ProductImageItem[] = files.map((file, index) => ({
  id: crypto.randomUUID(),

  url: URL.createObjectURL(file),

  publicId: null,

  file,

  isNew: true,

  sortOrder: images.length + index,

  deleted: false,

  status: "idle",

  progress: 0,
}));



    onChange([
      ...images,
      ...newImages,
    ]);



    e.target.value="";
  }




  function handleDragEnd(
    event: DragEndEvent
  ){

    const {
      active,
      over,
    } = event;


    if(!over) return;


    if(active.id === over.id)
      return;



const oldIndex =
  visibleImages.findIndex(
    (image) => image.id === active.id
  );

const newIndex =
  visibleImages.findIndex(
    (image) => image.id === over.id
  );

const reordered = arrayMove(
  visibleImages,
  oldIndex,
  newIndex
).map((image, index) => ({
  ...image,
  sortOrder: index,
}));

const deletedImages = images.filter(
  (image) => image.deleted
);

onChange([
  ...reordered,
  ...deletedImages,
]);

return;

  }




function removeImage(
  id: string
) {

const updated = images.flatMap((image) => {

  if (image.id !== id) {
    return [image];
  }

  if (image.isNew) {
    URL.revokeObjectURL(image.url);
    return [];
  }

  return [
    {
      ...image,
      deleted: true,
    },
  ];
});

const visible = updated
  .filter((image) => !image.deleted)
  .map((image, index) => ({
    ...image,
    sortOrder: index,
  }));

const deleted = updated.filter(
  (image) => image.deleted
);

onChange([
  ...visible,
  ...deleted,
]);

}

    return (
    <div className="space-y-8">

<UploadDropzone
  hasImages={visibleImages.length > 0}
  onUpload={handleUpload}
/>



      {/* Images Grid */}

{visibleImages.length > 0 && (
  <GalleryGrid
    images={visibleImages}
    sensors={sensors}
    onDragEnd={handleDragEnd}
    onDelete={removeImage}
  />
)}


    </div>
  );
}