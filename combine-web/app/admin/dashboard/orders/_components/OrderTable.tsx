type Order = {
  id: number;
};

type OrderTableProps = {
  orders: Order[];
};

export default function OrderTable({
  orders,
}: OrderTableProps) {

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="border-b border-neutral-200 bg-neutral-50">

          <tr>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Order
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Items
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Total
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Payment
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Status
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Date
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order.id}
              className="border-b border-neutral-100 hover:bg-neutral-50"
            >

              <td className="px-6 py-5">
                #{order.id}
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-neutral-400">
                —
              </td>

              <td className="px-6 py-5 text-right">

                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm transition hover:bg-neutral-100"
                >
                  View
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

}