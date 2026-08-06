export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-8">
      <div className="text-center">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.55em]
            text-neutral-400
          "
        >
          COMBINE
        </p>

        <h1
          className="
            mt-6
            text-6xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
          "
        >
          Loading
        </h1>

        <div
          className="
            mx-auto
            mt-10
            h-px
            w-28
            overflow-hidden
            bg-neutral-200
          "
        >
          <div
            className="
              h-full
              w-1/2
              animate-pulse
              bg-[#C8A96A]
            "
          />
        </div>

        <p
          className="
            mt-8
            text-sm
            tracking-[0.25em]
            uppercase
            text-neutral-400
          "
        >
          Please Wait
        </p>

      </div>
    </main>
  );
}