import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  pathname: string;
  searchParams: URLSearchParams;
};

export default function Pagination({
  page,
  totalPages,
  pathname,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function createPageLink(newPage: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", newPage.toString());

    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="mt-8 flex items-center justify-between">

      <Link
        href={
          page > 1
            ? createPageLink(page - 1)
            : "#"
        }
        className={`rounded-lg border px-4 py-2 ${
          page === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-neutral-100"
        }`}
      >
        ← Previous
      </Link>

      <div className="text-sm text-neutral-500">
        Page {page} of {totalPages}
      </div>

      <Link
        href={
          page < totalPages
            ? createPageLink(page + 1)
            : "#"
        }
        className={`rounded-lg border px-4 py-2 ${
          page === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-neutral-100"
        }`}
      >
        Next →
      </Link>

    </div>
  );
}