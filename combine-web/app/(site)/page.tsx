import Hero from "@/components/Hero";
import CollectionSection from "@/components/collections/CollectionSection";
import BrandShowcase from "@/components/BrandShowcase";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import FeaturedCollection from "@/components/FeaturedCollection";
import WhyChooseUs from "@/components/WhyChooseUs";
import MotionSection from "@/components/MotionSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Hero />

      <MotionSection>
        <CollectionSection />
      </MotionSection>

      <MotionSection delay={0.05}>
        <BrandShowcase />
      </MotionSection>

      <MotionSection delay={0.1}>
        <NewArrivals />
      </MotionSection>

      <MotionSection delay={0.15}>
        <BestSellers />
      </MotionSection>

      <MotionSection delay={0.2}>
        <FeaturedCollection />
      </MotionSection>

      <MotionSection delay={0.25}>
        <WhyChooseUs />
      </MotionSection>
    </main>
  );
}