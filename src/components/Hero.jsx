import { useRef, lazy, Suspense, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import MagneticWrapper from './ui/MagneticWrapper';

const HeroScene = lazy(() => import('./three/HeroScene'));

export default function Hero({ onOpenQuote }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [scrollVal, setScrollVal] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setScrollVal(v));

  // Text hidden at start, fades in mid-scroll, fades out at end
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75], [0, 0, 1, 0]);

  // Scene dims + desaturates while text is reading, then brightens for pull-out
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.65, 0.85, 1],
    [1, 1, 0.22, 0.22, 1, 1]
  );
  const sceneSaturate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.65, 0.85, 1],
    [1, 1, 0.35, 0.35, 1, 1]
  );
  const sceneFilter = useTransform(sceneSaturate, (s) => `saturate(${s})`);
  const contentY = useTransform(scrollYProgress, [0.2, 0.4], [60, 0]);

  // Staggered reveals
  const badgeOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const badgeX = useTransform(scrollYProgress, [0.2, 0.3], [-20, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.25, 0.35], [50, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.3, 0.4], [30, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.35, 0.45], [20, 0]);
  const trustOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);

  // Scroll indicator only at very top
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.02, 0.1], [1, 1, 0]);

  return (
    <section id="hero" ref={ref} className="hero hero--cinematic">
      <div className="hero__sticky">
        <motion.div
          className="hero__scene-wrap"
          style={{ opacity: sceneOpacity, filter: sceneFilter }}
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <HeroScene scrollProgress={scrollVal} />
          </Suspense>
        </motion.div>

        <motion.div
          className="hero__content"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <motion.div style={{ opacity: badgeOpacity, x: badgeX }}>
            <span className="hero__badge">India's Pioneering Display Technology Brand</span>
          </motion.div>

          <motion.h1 className="hero__title" style={{ opacity: titleOpacity, y: titleY }}>
            We Don't Build Screens.
            <br />
            <span className="hero__title-accent">We Engineer Emotions.</span>
          </motion.h1>

          <motion.p className="hero__subtitle" style={{ opacity: subtitleOpacity, y: subtitleY }}>
            MicroLED & TrueHue MiniLED displays with up to 281 trillion colors —
            crafted for stadiums, luxury residences, corporate command centers,
            and everywhere that demands awe.
          </motion.p>

          <motion.div className="hero__ctas" style={{ opacity: ctaOpacity, y: ctaY }}>
            <MagneticWrapper>
              <button className="btn btn--primary btn--lg" onClick={onOpenQuote}>
                <span>Pixel Quote Pro</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </MagneticWrapper>
            <MagneticWrapper>
              <a href="#products" className="btn btn--ghost btn--lg">
                Explore Products
              </a>
            </MagneticWrapper>
          </motion.div>

          <motion.div className="hero__trust" style={{ opacity: trustOpacity }}>
            <span>Up to 5-Year Warranty</span>
            <span className="hero__trust-dot" aria-hidden="true" />
            <span>Pan-India Installation</span>
            <span className="hero__trust-dot" aria-hidden="true" />
            <span>7 Years Support</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__scroll-indicator"
          style={{ opacity: scrollIndicatorOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="hero__scroll-line"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
