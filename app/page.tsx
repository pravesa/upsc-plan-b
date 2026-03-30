import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import PainPoints from '@/components/pain-points';
import Benefits from '@/components/benefits';
import Pricing from '@/components/pricing';
import Policies from '@/components/policies';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import FloatingCTA from '@/components/floating-cta';
import ResendBanner from '@/components/resend-banner';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainPoints />
      <Benefits />
      <Pricing />
      <Policies />
      <ResendBanner />
      <Contact />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
