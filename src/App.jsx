import { useState, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import CustomCursor from './components/ui/CustomCursor';
import SmoothScroll from './components/ui/SmoothScroll';
import Preloader from './components/ui/Preloader';
import ScrollProgress from './components/ScrollProgress';
import ScrollRail from './components/ui/ScrollRail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsMarquee from './components/StatsMarquee';
import About from './components/About';
import Products from './components/Products';
import Technology from './components/Technology';
import Applications from './components/Applications';
import Showcase from './components/Showcase';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import LeadCTA from './components/LeadCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import BuyersGuideCTA from './components/BuyersGuideCTA';
import LeadCaptureModal from './components/LeadCaptureModal';

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const openQuote = useCallback(() => setQuoteOpen(true), []);
  const closeQuote = useCallback(() => setQuoteOpen(false), []);
  const openGuide = useCallback(() => setGuideOpen(true), []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);

  return (
    <>
      <Preloader />
      <SmoothScroll />
      <CustomCursor />
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <ScrollProgress />
      <ScrollRail />
      <Navbar onOpenQuote={openQuote} />
      <main id="main-content">
        <Hero onOpenQuote={openQuote} />
        <StatsMarquee />
        <About />
        <Products onOpenQuote={openQuote} />
        <Technology />
        <Applications />
        <Showcase />
        <Process />
        <Testimonials />
        <BuyersGuideCTA onOpen={openGuide} />
        <LeadCTA onOpenQuote={openQuote} />
        <Contact />
      </main>
      <Footer onOpenGuide={openGuide} />
      <QuoteModal isOpen={quoteOpen} onClose={closeQuote} />
      <LeadCaptureModal isOpen={guideOpen} onClose={closeGuide} />
      <SpeedInsights />
    </>
  );
}
