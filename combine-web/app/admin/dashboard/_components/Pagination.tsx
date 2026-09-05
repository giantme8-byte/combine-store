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
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Previous */}
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


      {/* Page Info + Go To Page */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">

        <div className="text-sm text-neutral-500">
          Page {page} of {totalPages}
        </div>


        <form
          method="GET"
          action={pathname}
          className="flex items-center gap-2"
        >

          {/* Preserve existing filters */}
          {Array.from(
            searchParams.entries()
          ).map(([key, value]) => (
            key !== "page" && (
              <input
                key={`${key}-${value}`}
                type="hidden"
                name={key}
                value={value}
              />
            )
          ))}


          <label
            htmlFor="pagination-page"
            className="text-sm text-neutral-500"
          >
            Go to
          </label>


          <input
            id="pagination-page"
            name="page"
            type="number"
            min={1}
            max={totalPages}
            defaultValue={page}
            className="
              h-9
              w-16
              rounded-lg
              border
              border-neutral-300
              bg-white
              px-2
              text-center
              text-sm
              outline-none
              focus:border-neutral-500
              focus:ring-1
              focus:ring-neutral-300
            "
            aria-label="Page number"
          />


          <button
            type="submit"
            className="
              h-9
              rounded-lg
              border
              border-neutral-300
              bg-white
              px-3
              text-sm
              font-medium
              text-neutral-700
              hover:bg-neutral-100
            "
          >
            Go
          </button>

        </form>

      </div>


      {/* Next */}
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