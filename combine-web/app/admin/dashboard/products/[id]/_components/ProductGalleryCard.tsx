import Image from "next/image";

type ProductGalleryCardProps = {
  product: {
    name: string;
    images: {
      id: number;
      url: string;
      sortOrder: number;
    }[];
  };
};

export default function ProductGalleryCard({
  product,
}: ProductGalleryCardProps) {
  const mainImage = product.images[0];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-medium">
        Product Images
      </h2>

      <div className="overflow-hidden rounded-xl border">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            width={700}
            height={700}
            className="aspect-square w-full bg-neutral-50 object-contain p-6"
            priority
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-neutral-100 text-sm text-neutral-400">
            No Image
          </div>
        )}
      </div>

      {product.images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={product.name}
                width={120}
                height={120}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}