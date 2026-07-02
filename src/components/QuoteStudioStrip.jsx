import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticWrapper from './ui/MagneticWrapper';

/**
 * Quote Studio preview strip — the discovery surface for PQM v3.
 * Placed between Products and Technology so a scrolling visitor who has
 * just seen the product lineup gets a natural "…or just skip browsing
 * and get an engineered quote in 90 seconds" beat.
 */
export default function QuoteStudioStrip({ onOpenQuote }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section ref={ref} className="qstudio" aria-labelledby="qstudio-title">
      <motion.div className="qstudio__glow" style={{ y: glowY }} aria-hidden="true" />
      <div className="qstudio__grid" aria-hidden="true" />

      <div className="qstudio__inner">
        <motion.div
          className="qstudio__copy"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="qstudio__kicker">The Quote Studio</span>
          <h2 id="qstudio-title" className="qstudio__title">
            Get an engineered quote
            <br />
            <span className="qstudio__title-accent">in 90 seconds.</span>
          </h2>
          <p className="qstudio__lede">
            Interactive 3D preview. Structural load math. Per-SKU pricing pulled from
            our data sheets. A downloadable PDF your architect can hand to their MEP
            consultant. No salesperson required — but we're one click away if the
            project warrants it.
          </p>

          <div className="qstudio__proof">
            <div className="qstudio__proof-item">
              <span className="qstudio__proof-num">96</span>
              <span className="qstudio__proof-label">engineering tests · all green</span>
            </div>
            <div className="qstudio__proof-item">
              <span className="qstudio__proof-num">v3</span>
              <span className="qstudio__proof-label">3D stage · structural PDF</span>
            </div>
            <div className="qstudio__proof-item">
              <span className="qstudio__proof-num">0</span>
              <span className="qstudio__proof-label">form fields to see the tool</span>
            </div>
          </div>

          <div className="qstudio__actions">
            <MagneticWrapper>
              <button
                className="btn btn--primary btn--lg"
                onClick={onOpenQuote}
                aria-describedby="qstudio-title"
              >
                <span>Open Quote Studio</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </MagneticWrapper>
            <a href="/quote" className="qstudio__deeplink" target="_blank" rel="noopener noreferrer">
              Open in full window <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="qstudio__preview"
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          aria-hidden="true"
        >
          <div className="qstudio__preview-frame">
            <div className="qstudio__preview-chrome">
              <span className="qstudio__preview-dot" />
              <span className="qstudio__preview-dot" />
              <span className="qstudio__preview-dot" />
              <span className="qstudio__preview-label">Pixel Quote Max · v3</span>
            </div>
            <div className="qstudio__preview-stage">
              <div className="qstudio__preview-glow" />
              <div className="qstudio__preview-panel" data-panel="a" />
              <div className="qstudio__preview-panel" data-panel="b" />
              <div className="qstudio__preview-panel" data-panel="c" />
              <div className="qstudio__preview-panel" data-panel="d" />
              <div className="qstudio__preview-grid" />
              <div className="qstudio__preview-caption">
                <span className="qstudio__preview-pill">Reyansh Indoor · P1.86</span>
                <span className="qstudio__preview-pill">3.66 m × 2.06 m</span>
                <span className="qstudio__preview-pill">₹ live</span>
              </div>
            </div>
            <div className="qstudio__preview-readout">
              <div className="qstudio__preview-metric">
                <span className="qstudio__preview-metric-key">MVD</span>
                <span className="qstudio__preview-metric-val">6.39 m</span>
              </div>
              <div className="qstudio__preview-metric">
                <span className="qstudio__preview-metric-key">Peak</span>
                <span className="qstudio__preview-metric-val">700 nits</span>
              </div>
              <div className="qstudio__preview-metric">
                <span className="qstudio__preview-metric-key">Load</span>
                <span className="qstudio__preview-metric-val">88 kg</span>
              </div>
              <div className="qstudio__preview-metric">
                <span className="qstudio__preview-metric-key">Power</span>
                <span className="qstudio__preview-metric-val">1.9 kW</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
