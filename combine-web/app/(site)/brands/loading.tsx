import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-8 py-24">
      <div className="mb-12 space-y-4 text-center">
        <Skeleton className="mx-auto h-10 w-72" />
        <Skeleton className="mx-auto h-5 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-neutral-200 p-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <Skeleton className="h-20 w-20 rounded-full" />

              <Skeleton className="h-6 w-36" />

              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}