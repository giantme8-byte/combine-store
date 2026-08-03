type Order = {
  id: number;
};

type OrderGridProps = {
  orders: Order[];
};

export default function OrderGrid({
  orders,
}: OrderGridProps) {

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      {orders.map((order) => (

        <div
          key={order.id}
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-6
          "
        >

          <p className="text-sm text-neutral-500">
            Order
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            #{order.id}
          </h3>

          <p className="mt-6 text-neutral-400">
            Customer information will appear here.
          </p>

        </div>

      ))}

    </div>
  );

}