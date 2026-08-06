import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero-luxury.png"
        alt="COMBINE Luxury Collection"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/28" />

      {/* Luxury Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/5 to-transparent md:h-72" />
    </section>
  );
}