import { motion } from 'framer-motion';

export default function BuyersGuideCTA({ onOpen }) {
  return (
    <section className="bg-cta" aria-label="Download the LED Buyer's Guide">
      <motion.div
        className="bg-cta__inner"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-cta__art" aria-hidden="true">
          <div className="bg-cta__pdf">
            <span className="bg-cta__pdf-corner" />
            <span className="bg-cta__pdf-bar" />
            <span className="bg-cta__pdf-bar bg-cta__pdf-bar--short" />
            <span className="bg-cta__pdf-bar" />
            <span className="bg-cta__pdf-bar bg-cta__pdf-bar--med" />
            <span className="bg-cta__pdf-label">PDF</span>
          </div>
        </div>

        <div className="bg-cta__copy">
          <span className="bg-cta__kicker">Free Download · 12 Pages</span>
          <h2 className="bg-cta__title">
            The <span className="text-gradient">LED Buyer's Guide</span>
          </h2>
          <p className="bg-cta__lede">
            The honest, science-backed handbook for anyone evaluating a MicroLED
            or MiniLED installation in India. Arc minute math, the seven questions
            every vendor should answer, the contrast trap. Read this before you
            accept the first quote.
          </p>
          <ul className="bg-cta__bullets">
            <li>The 1 arc minute rule — with the full pitch reference table</li>
            <li>Static vs dynamic contrast — what your eyes actually see</li>
            <li>The 7 questions every LED salesperson should answer</li>
            <li>SMD vs GOB vs COB — what changes, what doesn't</li>
          </ul>
          <button className="btn btn--primary bg-cta__btn" onClick={onOpen}>
            Get the Buyer's Guide
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
          <p className="bg-cta__fineprint">No spam · One click unsubscribe · Used by 200+ AV consultants</p>
        </div>
      </motion.div>
    </section>
  );
}
