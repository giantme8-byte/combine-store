import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-8 lg:px-12">
      <div className="max-w-3xl text-center">

        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          ERROR
        </p>

        <h1
          className="
            mt-6
            text-8xl
            font-extralight
            tracking-[-0.06em]
            text-neutral-900
            md:text-9xl
          "
        >
          404
        </h1>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <h2
          className="
            mt-10
            text-4xl
            font-extralight
            tracking-[-0.03em]
            text-neutral-900
          "
        >
          Page Not Found
        </h2>

        <p
          className="
            mx-auto
            mt-8
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Explore our collections or return to the homepage.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-5">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-full
              bg-black
              px-10
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
            "
          >
            Return Home
          </Link>

          <Link
            href="/shop"
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-neutral-300
              px-10
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-700
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#C8A96A]
              hover:text-[#C8A96A]
              hover:shadow-lg
            "
          >
            Browse Collection
          </Link>

        </div>

      </div>
    </main>
  );
}