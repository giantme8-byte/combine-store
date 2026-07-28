export default function Loading() {
  return (
    <main className="mx-auto max-w-[1440px] px-8 pb-32 pt-36 lg:px-12">
      <div className="animate-pulse">

        <div className="h-10 w-64 rounded bg-neutral-200" />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
            >
              <div className="aspect-[4/5] bg-neutral-200" />

              <div className="space-y-4 p-5">

                <div className="h-3 w-20 rounded bg-neutral-200" />

                <div className="h-8 w-3/4 rounded bg-neutral-200" />

                <div className="h-4 w-24 rounded bg-neutral-200" />

                <div className="flex justify-between pt-6">

                  <div className="h-3 w-24 rounded bg-neutral-200" />

                  <div className="h-5 w-5 rounded-full bg-neutral-200" />

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}