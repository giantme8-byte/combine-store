"use server";

import { Availability, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Buffer } from "buffer";


type UploadedImage = {
  url: string;
  publicId: string;
  sortOrder: number;
};
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(
  file: File,
  folder: string
) {
  const bytes =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(bytes);

const result = await new Promise<UploadApiResponse>(
  (resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Cloudinary upload returned no result."));
          }
        }
      )
      .end(buffer);
  }
);


  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}







export async function createProduct(
  formData: FormData
) {

try {

  // Gallery Images
  const files =
    formData.getAll("images") as File[];

  const uploadedImages: UploadedImage[] = [];

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    if (!file || file.size === 0)
      continue;

    const uploaded = await uploadImage(
      file,
      "combine-store/gallery"
    );

    uploadedImages.push({
      url: uploaded.url,
      publicId: uploaded.publicId,
      sortOrder: i,
    });

  }

  // Product Colors
  const colorFiles =
    formData.getAll("colorImages") as File[];

  type ColorOrderItem = {
    id: string;
    publicId: string | null;
    name: string;
    sortOrder: number;
    isNew: boolean;
    deleted: boolean;
  };

  const colorOrder =
    formData
      .getAll("colorOrder")
      .map((item) =>
        JSON.parse(item.toString())
      ) as ColorOrderItem[];

  const newColorOrder =
    colorOrder.filter(
      (color) =>
        color.isNew &&
        !color.deleted
    );

  const uploadedColors: {
    name: string;
    imageUrl: string;
    publicId: string;
    sortOrder: number;
  }[] = [];

  for (let i = 0; i < colorFiles.length; i++) {

    const file = colorFiles[i];

    if (!file || file.size === 0)
      continue;

    const uploaded = await uploadImage(
      file,
      "combine-store/colors"
    );

    uploadedColors.push({
      name: newColorOrder[i].name,
      imageUrl: uploaded.url,
      publicId: uploaded.publicId,
      sortOrder: newColorOrder[i].sortOrder,
    });

  }

    await prisma.product.create({

      data:{


brand:
  formData.get("brand") as string,

sku:
  formData.get("sku")?.toString() || null,

name:
  formData.get("name") as string,

slug:
  (
    formData.get("slug")?.toString().trim() ||
    slugify(formData.get("name") as string)
  ),

model:
          formData.get(
            "model"
          )?.toString()
          || null,


        shortDescription:
          formData.get(
            "shortDescription"
          )?.toString()
          || null,


        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,


        priceRemark:
          formData.get(
            "priceRemark"
          )?.toString()
          || null,


        price:
          Number(
            formData.get(
              "price"
            )
          ),



        description:
          formData.get(
            "description"
          ) as string,



        category:
          formData.get(
            "category"
          ) as string,


        subCategory:
          formData.get(
            "subCategory"
          )?.toString()
          || null,



        mainColor:
          formData.get(
            "mainColor"
          )?.toString()
          || null,



        dimensions:
          formData.get(
            "dimensions"
          )?.toString()
          || null,



        availability:
          formData.get(
            "availability"
          ) as Availability,



        featured:
          formData.get(
            "featured"
          ) === "on",


        newArrival:
          formData.get(
            "newArrival"
          ) === "on",


        bestSeller:
          formData.get(
            "bestSeller"
          ) === "on",


        limited:
          formData.get(
            "limited"
          ) === "on",


        onSale:
          formData.get(
            "onSale"
          ) === "on",



        images:{
          create:
            uploadedImages,
        },

        colors: {
  create:
    uploadedColors,
},


      },

    });



    redirect(
      "/admin/dashboard/products"
    );


  } catch(err){

    console.error(err);

    throw err;

  }

}
export async function updateProduct(
  id:number,
  formData:FormData
){

  try {


const product =
  await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      colors: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });



    if(!product){

      throw new Error(
        "Product not found"
      );

    }




const files =
  formData.getAll("images") as File[];

type ImageOrderItem = {
  id: string;
  publicId: string | null;
  sortOrder: number;
  isNew: boolean;
  deleted: boolean;
};

const imageOrder = formData
  .getAll("imageOrder")
  .map((item) => JSON.parse(item.toString())) as ImageOrderItem[];

const newImageOrder = imageOrder.filter(
  (image) => image.isNew && !image.deleted
);  

const uploadedImages: UploadedImage[] = [];

const colorFiles =
  formData.getAll("colorImages") as File[];

type ColorOrderItem = {
  id: string;
  publicId: string | null;
  name: string;
  sortOrder: number;
  isNew: boolean;
  deleted: boolean;
  hasNewImage: boolean;
};

const colorOrder = formData
  .getAll("colorOrder")
  .map((item) =>
    JSON.parse(item.toString())
  ) as ColorOrderItem[];

const newColorOrder =
  colorOrder.filter(
    (color) =>
      color.isNew &&
      !color.deleted
  );

const replaceColors =
  colorOrder.filter(
    (color) =>
      !color.isNew &&
      !color.deleted &&
      color.hasNewImage
  );

const uploadedColors: {
  name: string;
  imageUrl: string;
  publicId: string;
  sortOrder: number;
}[] = [];

    if(files.length > 0){

      for(
        let i = 0;
        i < files.length;
        i++
      ){

        const file =
          files[i];

        if(
          !file ||
          file.size === 0
        )
          continue;

        const uploaded =
          await uploadImage(
            file,
            "combine-store/gallery"
          );

uploadedImages.push({
  url: uploaded.url,
  publicId: uploaded.publicId,
  sortOrder: newImageOrder[i].sortOrder,
});

      }

    }


    for(
      let i = 0;
      i < colorFiles.length;
      i++
    ){

      const file =
        colorFiles[i];

      if(
        !file ||
        file.size === 0
      )
        continue;

      const uploaded =
        await uploadImage(
          file,
          "combine-store/colors"
        );

uploadedColors.push({

  name:
    newColorOrder[i].name,

  imageUrl:
    uploaded.url,

  publicId:
    uploaded.publicId,

  sortOrder:
    newColorOrder[i].sortOrder,

});

    }


    await prisma.product.update({

      where:{
        id,
      },


      data:{


brand:
  formData.get("brand") as string,

sku:
  formData.get("sku")?.toString() || null,

name:
  formData.get("name") as string,

slug:
  (
    formData.get("slug")?.toString().trim() ||
    slugify(formData.get("name") as string)
  ),

model:
          formData.get(
            "model"
          )?.toString()
          || null,


        shortDescription:
          formData.get(
            "shortDescription"
          )?.toString()
          || null,


        costPriceCny:
          Number(
            formData.get(
              "costPriceCny"
            )
          ) || null,


        priceRemark:
          formData.get(
            "priceRemark"
          )?.toString()
          || null,


        price:
          Number(
            formData.get(
              "price"
            )
          ),


        description:
          formData.get(
            "description"
          ) as string,



        category:
          formData.get(
            "category"
          ) as string,


        subCategory:
          formData.get(
            "subCategory"
          )?.toString()
          || null,



        mainColor:
          formData.get(
            "mainColor"
          )?.toString()
          || null,



        dimensions:
          formData.get(
            "dimensions"
          )?.toString()
          || null,



        availability:
          formData.get(
            "availability"
          ) as Availability,



        featured:
          formData.get(
            "featured"
          )
          === "on",


        newArrival:
          formData.get(
            "newArrival"
          )
          === "on",


        bestSeller:
          formData.get(
            "bestSeller"
          )
          === "on",


        limited:
          formData.get(
            "limited"
          )
          === "on",


        onSale:
          formData.get(
            "onSale"
          )
          === "on",

      },

    });

const deletedImages = imageOrder.filter(
  (image) => !image.isNew && image.deleted
);

console.log("deletedImages:", deletedImages);

for (const image of deletedImages) {

  console.log("Deleting Cloudinary:", image.publicId);

  if (image.publicId) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  console.log("Deleting DB Image:", image.id);

  await prisma.productImage.delete({
    where: {
      id: Number(image.id),
    },
  });
}

await prisma.productImage.updateMany({
  where: {
    productId: id,
  },
  data: {
    sortOrder: {
      increment: 1000,
    },
  },
});

for (const image of imageOrder.filter(
  (image) => !image.isNew && !image.deleted
)) {
  await prisma.productImage.update({
    where: {
      id: Number(image.id),
    },
    data: {
      sortOrder: image.sortOrder,
    },
  });
}

if (uploadedImages.length > 0) {
  await prisma.productImage.createMany({
    data: uploadedImages.map((image) => ({
      productId: id,
      url: image.url,
      publicId: image.publicId,
      sortOrder: image.sortOrder,
    })),
  });
}

const deletedColors = colorOrder.filter(
  (color) => !color.isNew && color.deleted
);

for (const color of deletedColors) {

  if (color.publicId) {
    await cloudinary.uploader.destroy(
      color.publicId
    );
  }

  await prisma.productColor.delete({
    where: {
      id: Number(color.id),
    },
  });

}

await prisma.productColor.updateMany({
  where: {
    productId: id,
  },
  data: {
    sortOrder: {
      increment: 1000,
    },
  },
});

for (
  const color of colorOrder.filter(
    (color) =>
      !color.isNew &&
      !color.deleted
  )
) {

  await prisma.productColor.update({
    where: {
      id: Number(color.id),
    },
    data: {
      name: color.name,
      sortOrder: color.sortOrder,
    },
  });

}

if (uploadedColors.length > 0) {

  await prisma.productColor.createMany({

    data: uploadedColors.map(
      (color) => ({
        productId: id,
        name: color.name,
        imageUrl: color.imageUrl,
        publicId: color.publicId,
        sortOrder: color.sortOrder,
      })
    ),

  });

}


    redirect(
      "/admin/dashboard/products"
    );


  }catch(err){

    console.error(err);

    throw err;

  }

}








export async function duplicateProduct(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
include: {
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  colors: {
    orderBy: {
      sortOrder: "asc",
    },
  },
},
  });

  if (!product) {
    redirect("/admin/dashboard/products");
  }

  const newProduct = await prisma.product.create({
    data: {
      sku: null,

      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory,

      name: `${product.name} (Copy)`,
      model: product.model,

      shortDescription: product.shortDescription,
      description: product.description,

      costPriceCny: product.costPriceCny,
      priceRemark: product.priceRemark,

      price: product.price,

      mainColor: product.mainColor,
      dimensions: product.dimensions,

      availability: product.availability,

      featured: product.featured,
      newArrival: product.newArrival,
      bestSeller: product.bestSeller,
      limited: product.limited,
      onSale: product.onSale,

      images: {
        create: product.images.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          sortOrder: image.sortOrder,
        })),
      },

      colors: {
        create: product.colors.map((color) => ({
          name: color.name,
          imageUrl: color.imageUrl,
          publicId: color.publicId,
          sortOrder: color.sortOrder,
        })),
      },
    },
  });

  redirect(`/admin/dashboard/products/${newProduct.id}/edit`);
}

export async function deleteProduct(id: number) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      colors: true,
    },
  });

  if (!product) {
    redirect("/admin/dashboard/products");
  }

  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  for (const color of product.colors) {
    await cloudinary.uploader.destroy(color.publicId);
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/dashboard/products");
}

export async function deleteProducts(ids: number[]) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      images: true,
      colors: true,
    },
  });

  for (const product of products) {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    for (const color of product.colors) {
      await cloudinary.uploader.destroy(color.publicId);
    }
  }

  await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  revalidatePath("/admin/dashboard/products");
}

export async function updateProducts(
  ids: number[],
  data: {
    brand?: string;
    category?: string;
    availability?: Availability;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    limited?: boolean;
    onSale?: boolean;
    price?: number;
  }
) {
  await prisma.product.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data,
  });

  revalidatePath("/admin/dashboard/products");
}