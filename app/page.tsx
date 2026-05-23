import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Navbar from "@/components/storefront/Navbar";
import Hero from "@/components/storefront/Hero";
import MarqueeBanner from "@/components/storefront/MarqueeBanner";
import ProductSpotlight from "@/components/storefront/ProductSpotlight";
import WhyAIYM from "@/components/storefront/WhyAIYM";
import HowToUse from "@/components/storefront/HowToUse";
import TanStory from "@/components/storefront/TanStory";
import ShadeComparison from "@/components/storefront/ShadeComparison";
import OfferBanner from "@/components/storefront/OfferBanner";
import UGCGrid from "@/components/storefront/UGCGrid";
import GlowPromise from "@/components/storefront/GlowPromise";
import FAQAccordion from "@/components/storefront/FAQAccordion";
import Newsletter from "@/components/storefront/Newsletter";
import Footer from "@/components/storefront/Footer";
import CookieBanner from "@/components/storefront/CookieBanner";
import ScrollToTop from "@/components/storefront/ScrollToTop";
import { CartProvider } from "@/components/storefront/CartDrawer";

export default function Home() {
  return (
    <CartProvider>
      {/* AnnouncementBar is fixed at top-0, Navbar is fixed at top-10 */}
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero is full-screen, sits behind the fixed bars */}
        <Hero />
        <MarqueeBanner />
        <ProductSpotlight />
        <WhyAIYM />
        <HowToUse />
        <TanStory />
        <ShadeComparison />
        <OfferBanner />
        <UGCGrid />
        <GlowPromise />
        <FAQAccordion />
        <Newsletter />
      </main>
      <Footer />
      <CookieBanner />
      <ScrollToTop />
    </CartProvider>
  );
}
