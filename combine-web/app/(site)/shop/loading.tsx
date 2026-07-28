import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-8 py-24">
      <div className="mb-10 flex items-center justify-between">
        <Skeleton className="h-10 w-72" />

        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4"
          >
            <Skeleton className="aspect-[4/5] rounded-3xl" />

            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-6 w-48" />

            <Skeleton className="h-5 w-28" />
          </div>
        ))}
      </div>
    </main>
  );
}