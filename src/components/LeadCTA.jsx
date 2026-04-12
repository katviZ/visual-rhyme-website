import { motion } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import FloatingOrbs from './ui/FloatingOrbs';
import MagneticWrapper from './ui/MagneticWrapper';

export default function LeadCTA({ onOpenQuote }) {
  return (
    <RevealSection className="lead-cta">
      <div className="lead-cta__inner">
        <FloatingOrbs />
        <motion.h2
          className="lead-cta__title"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Transform Your Space?
        </motion.h2>
        <p className="lead-cta__subtitle">
          Tell us your vision. We'll engineer the experience.
        </p>
        <div className="lead-cta__buttons">
          <MagneticWrapper>
            <button className="btn btn--primary btn--lg" onClick={onOpenQuote}>
              Pixel Quote Pro
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </MagneticWrapper>
          <MagneticWrapper>
            <a href="tel:+919974531845" className="btn btn--ghost btn--lg">
              Call: +91 99745 31845
            </a>
          </MagneticWrapper>
        </div>
      </div>
    </RevealSection>
  );
}
