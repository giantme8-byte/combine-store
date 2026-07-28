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



  function handleUpload(
    e: ChangeEvent<HTMLInputElement>
  ){

    const files = Array.from(
      e.target.files ?? []
    );


    if(!files.length) return;



    const newImages =
      files.map(
        (file)=>({
          id: crypto.randomUUID(),

          url: URL.createObjectURL(
            file
          ),

          publicId:null,

          file,

          isNew:true,
        })
      );



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
      images.findIndex(
        (image)=>
          image.id === active.id
      );


    const newIndex =
      images.findIndex(
        (image)=>
          image.id === over.id
      );


    onChange(
      arrayMove(
        images,
        oldIndex,
        newIndex
      )
    );

  }




  function removeImage(
    id:string
  ){

    onChange(
      images.filter(
        (image)=>
          image.id !== id
      )
    );

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


        {images.length === 0 ? (

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

      {images.length > 0 && (

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={
              images.map(
                (image)=>image.id
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

              {images.map(
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