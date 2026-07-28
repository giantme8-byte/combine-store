import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-8 py-20">
      <div className="grid gap-16 lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-3xl" />

        <div className="space-y-6">
          <Skeleton className="h-5 w-24" />

          <Skeleton className="h-12 w-96" />

          <Skeleton className="h-8 w-40" />

          <Skeleton className="h-32 w-full" />

          <Skeleton className="h-12 w-full rounded-full" />

          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </main>
  );
}