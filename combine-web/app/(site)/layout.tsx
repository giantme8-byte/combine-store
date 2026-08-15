import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import WebsiteAnalytics from "@/components/analytics/WebsiteAnalytics";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="pt-[88px]">
        {children}
      </main>

      <Footer />

      <FloatingWhatsApp />

      <WebsiteAnalytics />
    </>
  );
}