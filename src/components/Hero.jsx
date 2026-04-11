import { useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FloatingOrbs from './ui/FloatingOrbs';
import GlowGrid from './ui/GlowGrid';

const HeroScene = lazy(() => import('./three/HeroScene'));

export default function Hero({ onOpenQuote }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <section id="hero" ref={ref} className="hero">
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
      <FloatingOrbs />
      <GlowGrid />

      <motion.div className="hero__content" style={{ y, opacity, scale, rotateX, perspective: 1200 }}>
        <motion.div
          className="hero__eyebrow"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="hero__badge">India's Pioneering Display Technology Brand</span>
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          We Don't Build Screens.
          <br />
          <span className="hero__title-accent">We Engineer Emotions.</span>
        </motion.h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          MicroLED & TrueHue MiniLED displays with up to 281 trillion colors —
          crafted for stadiums, luxury residences, corporate command centers,
          and everywhere that demands awe.
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <button className="btn btn--primary btn--lg" onClick={onOpenQuote}>
            <span>Pixel Quote Pro</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="#products" className="btn btn--ghost btn--lg">
            Explore Products
          </a>
        </motion.div>

        <motion.div
          className="hero__trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span>Up to 5-Year Warranty</span>
          <span className="hero__trust-dot" aria-hidden="true" />
          <span>Pan-India Installation</span>
          <span className="hero__trust-dot" aria-hidden="true" />
          <span>7 Years Support</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-hidden="true"
      >
        <motion.div
          className="hero__scroll-line"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}
