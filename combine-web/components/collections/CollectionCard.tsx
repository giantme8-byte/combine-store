import Image from "next/image";
import Link from "next/link";

type CollectionCardProps = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export default function CollectionCard({
  title,
  subtitle,
  image,
  href,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[36px] border border-white/10 bg-neutral-100 shadow-lg transition-all duration-700 hover:-translate-y-1 hover:border-[#C8A96A]/50 hover:shadow-2xl"
    >
      <div className="relative h-[380px] lg:h-[560px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-all duration-700 group-hover:from-black/70 group-hover:via-black/15 group-hover:to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-white">
          <span className="text-[10px] uppercase tracking-[0.45em] text-white/70">
            Collection
          </span>

          <h3 className="mt-3 text-3xl font-light tracking-[0.25em] md:text-4xl">
            {title}
          </h3>

          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/80">
            {subtitle}
          </p>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] transition-all duration-300 group-hover:text-[#C8A96A]">
            <span>Discover Collection</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}