import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticWrapper from './ui/MagneticWrapper';

export default function LeadCTA({ onOpenQuote }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Subtle mesh parallax — background drifts against scroll direction.
  const meshY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const meshX = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <section ref={ref} className="lead-cta-pin">
      <motion.div
        className="lead-cta-pin__mesh"
        style={{ x: meshX, y: meshY }}
        aria-hidden="true"
      />
      <div className="lead-cta-pin__scrim" aria-hidden="true" />
      <div className="lead-cta-pin__grid" aria-hidden="true" />

      <motion.div
        className="lead-cta-pin__content"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="lead-cta-pin__kicker">— The Final Step</span>

        <h2 className="lead-cta-pin__title">
          Ready to Transform
          <br />
          <span className="lead-cta-pin__title-accent">Your Space?</span>
        </h2>

        <p className="lead-cta-pin__subtitle">
          Tell us your vision. We'll engineer the experience —
          from the first consultation to seven years of support.
        </p>

        <div className="lead-cta-pin__buttons">
          <MagneticWrapper>
            <button className="btn btn--primary btn--lg" onClick={onOpenQuote}>
              <span>Pixel Quote Pro</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </MagneticWrapper>
          <MagneticWrapper>
            <a href="tel:+919974531845" className="btn btn--ghost btn--lg">
              Call: +91 99745 31845
            </a>
          </MagneticWrapper>
        </div>
      </motion.div>
    </section>
  );
}
