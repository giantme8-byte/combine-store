"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useEffect,
} from "react";
import {
  ImagePlus,
  X,
} from "lucide-react";

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



const newImages = files.map((file, index) => ({
  id: crypto.randomUUID(),

  url: URL.createObjectURL(file),

  publicId: null,

  file,

  isNew: true,

  sortOrder: images.length + index,

  deleted: false,
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

      {/* Upload */}
      <div>

        <label
          className="
            mb-3
            block
            text-sm
            font-semibold
            text-neutral-800
          "
        >
          Product Images
        </label>


        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />


        {visibleImages.length === 0 ? (

          <label
            htmlFor="image-upload"
            className="
              flex
              aspect-square
              w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-3xl
              border-2
              border-dashed
              border-neutral-300
              bg-neutral-50
              transition
              hover:border-black
              hover:bg-neutral-100
            "
          >

            <ImagePlus
              size={54}
              className="text-neutral-400"
            />


            <p className="mt-5 text-lg font-semibold">
              Upload Images
            </p>


            <p className="mt-2 text-sm text-neutral-500">
              First image will be cover
            </p>

          </label>


        ) : (

          <label
            htmlFor="image-upload"
            className="
              flex
              h-28
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-neutral-300
              bg-neutral-50
              transition
              hover:border-black
              hover:bg-neutral-100
            "
          >

            <ImagePlus
              size={34}
              className="text-neutral-400"
            />


            <p className="font-semibold">
              Add More Images
            </p>


          </label>

        )}

      </div>



      {/* Images Grid */}

      {visibleImages.length > 0 && (

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
items={
  visibleImages.map(
    (image) => image.id
  )
}
            strategy={rectSortingStrategy}
          >

            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >

              {visibleImages.map(
                (image,index)=>(

                  <div
                    key={image.id}
                    className="
                      relative
                    "
                  >

                    {index === 0 && (

                      <div
                        className="
                          absolute
                          left-2
                          top-2
                          z-10
                          rounded-full
                          bg-black
                          px-3
                          py-1
                          text-xs
                          uppercase
                          tracking-wider
                          text-white
                        "
                      >
                        Cover
                      </div>

                    )}


                    <SortableImage
                      image={image}
                      index={index}
                      onDelete={() =>
                        removeImage(
                          image.id
                        )
                      }
                    />


                  </div>

                )
              )}

            </div>


          </SortableContext>


        </DndContext>

      )}


    </div>
  );
}