import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl space-y-16 px-8 py-20">
      <section className="space-y-6">
        <Skeleton className="h-14 w-96 max-w-full" />
        <Skeleton className="h-6 w-[32rem] max-w-full" />
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </section>

      <section className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-square rounded-3xl"
          />
        ))}
      </section>
    </main>
  );
}