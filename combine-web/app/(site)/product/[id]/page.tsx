import { products } from "../../../data/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find(
    (p) => p.id === Number(id)
  );

  if (!product) {
    return (
      <main className="p-20">
        <h1>Product Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-12">
      <h1 className="text-5xl font-light mb-10">
        {product.name}
      </h1>

      <div className="grid grid-cols-2 gap-12">
<img
  src={product.image}
  alt={product.name}
  className="w-full h-[600px] object-cover rounded-lg"
/>

        <div>
          <p className="text-gray-500">
            {product.brand}
          </p>

          <h2 className="text-4xl mt-2">
            RM {product.price.toLocaleString()}
          </h2>

         <a
  href="https://wa.me/60166620448"
  target="_blank"
  className="inline-block mt-10 bg-black text-white px-10 py-4"
>
  Contact Us
</a>
        </div>
      </div>
    </main>
  );
}