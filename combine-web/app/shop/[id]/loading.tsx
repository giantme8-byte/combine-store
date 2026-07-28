export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8 animate-pulse">

      {/* Breadcrumb */}
      <div className="h-4 w-64 rounded bg-neutral-200" />

      <section className="mt-12 grid gap-20 lg:grid-cols-[1.15fr_0.85fr]">

        {/* Gallery */}
        <div>

          <div className="aspect-[4/5] rounded-[32px] bg-neutral-200" />

          <div className="mt-6 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl bg-neutral-200"
              />
            ))}
          </div>

        </div>

        {/* Product Info */}
        <div>

          <div className="h-3 w-28 rounded bg-neutral-200" />

          <div className="mt-6 h-14 w-3/4 rounded bg-neutral-200" />

          <div className="mt-8 h-5 w-full rounded bg-neutral-200" />
          <div className="mt-3 h-5 w-5/6 rounded bg-neutral-200" />

          {/* Badges */}
          <div className="mt-8 flex gap-3">
            <div className="h-8 w-20 rounded-full bg-neutral-200" />
            <div className="h-8 w-24 rounded-full bg-neutral-200" />
          </div>

          {/* Product Information */}
          <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-8">

            <div className="grid gap-8 lg:grid-cols-2">

              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <div className="h-3 w-24 rounded bg-neutral-200" />
                  <div className="mt-3 h-5 w-40 rounded bg-neutral-200" />
                </div>
              ))}

            </div>

          </div>

          {/* Description */}
          <div className="mt-12">

            <div className="h-3 w-32 rounded bg-neutral-200" />

            <div className="mt-6 space-y-3">

              <div className="h-4 rounded bg-neutral-200" />
              <div className="h-4 rounded bg-neutral-200" />
              <div className="h-4 w-5/6 rounded bg-neutral-200" />
              <div className="h-4 w-2/3 rounded bg-neutral-200" />

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-14">

            <div className="h-14 w-full rounded-full bg-neutral-200" />

            <div className="mt-4 flex gap-4">

              <div className="h-12 flex-1 rounded-full bg-neutral-200" />

              <div className="h-12 flex-1 rounded-full bg-neutral-200" />

            </div>

          </div>

        </div>

      </section>

      {/* Related Products */}
      <section className="mt-40">

        <div className="mx-auto h-3 w-40 rounded bg-neutral-200" />

        <div className="mx-auto mt-6 h-10 w-80 rounded bg-neutral-200" />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
            >
              <div className="aspect-[4/5] bg-neutral-200" />

              <div className="space-y-4 p-5">

                <div className="h-3 w-20 rounded bg-neutral-200" />

                <div className="h-8 w-3/4 rounded bg-neutral-200" />

                <div className="h-4 w-24 rounded bg-neutral-200" />

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}