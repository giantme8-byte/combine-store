import Link from "next/link";

type Item = {
  label: string;
  href?: string;
};

type Props = {
  items: Item[];
};

export default function Breadcrumb({
  items,
}: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-10"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast =
            index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-black"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="font-medium text-black"
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span
                  className="text-gray-300"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}