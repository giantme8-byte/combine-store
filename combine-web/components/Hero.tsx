import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[620px] overflow-hidden">
      <Image
        src="/images/hero-luxury.png"
        alt="Hero"
        fill
        priority
        className="object-cover"
      />
    </section>
  );
}