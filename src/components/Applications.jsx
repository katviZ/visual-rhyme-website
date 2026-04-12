import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LineReveal from './ui/LineReveal';

const applicationItems = [
  {
    title: 'Board & Meeting Rooms',
    category: 'Corporate',
    kicker: 'Leynna Cosmo · Sapphire',
    description:
      'MicroLED walls that command the room. Noise-free, glare-free, and calibrated for boardrooms where every pixel is on record.',
  },
  {
    title: 'Stadiums & Arenas',
    category: 'Outdoor',
    kicker: 'Reyansh Outdoor P3/P4/P6',
    description:
      'Up to 11,000 nits of daylight-visible brilliance. IP65-rated, 4,396 billion colors, tuned for live action from the front row to the nosebleeds.',
  },
  {
    title: 'Luxury Residences',
    category: 'Premium',
    kicker: 'Leynna Sapphire TV',
    description:
      '108" to 163" MicroLED televisions with 281 trillion colors and Graviton Black surface treatment. Furniture for the ultra-premium home.',
  },
  {
    title: 'Indoor DOOH Advertising',
    category: 'Retail',
    kicker: 'Reyansh Indoor · Cloud CMS',
    description:
      'Seamless front-serviceable panels with cloud content management. Airports, malls, and flagship stores — orchestrated from one dashboard.',
  },
  {
    title: 'Control & Command Centers',
    category: 'Mission Critical',
    kicker: 'Leynna Cosmo · 120Hz',
    description:
      'Low-latency, high-refresh displays built for 24/7 operation. Color-accurate across every shift, calibrated for decisions that matter.',
  },
  {
    title: 'Experience Centers & Museums',
    category: 'Immersive',
    kicker: 'Sapphire MicroLED · HDR10',
    description:
      'Life-like visual storytelling with HDR10/HLG and 95%+ DCI-P3 coverage. Curated environments that move people.',
  },
];

export default function Applications() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const n = applicationItems.length;
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(n - 1) * 100}vw`]);
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(n - 1, Math.floor(v * n + 0.001))
  );

  return (
    <section
      ref={ref}
      id="applications"
      className="apps-pin"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="apps-pin__sticky">
        <div className="apps-pin__header">
          <span className="section-label">Applications</span>
          <LineReveal as="h2" className="section-title">
            Built For Spaces That
            <span className="text-gradient"> Demand Extraordinary</span>
          </LineReveal>
        </div>

        <div className="apps-pin__viewport">
          <motion.div className="apps-pin__strip" style={{ x }}>
            {applicationItems.map((item, i) => (
              <article key={item.title} className="apps-pin__card">
                <div className="apps-pin__media" aria-hidden="true">
                  <span className="apps-pin__media-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="apps-pin__media-category">{item.category}</span>
                </div>
                <div className="apps-pin__body">
                  <span className="apps-pin__kicker">{item.kicker}</span>
                  <h3 className="apps-pin__title">{item.title}</h3>
                  <p className="apps-pin__desc">{item.description}</p>
                </div>
                <div className="apps-pin__frame" aria-hidden="true">
                  <span className="apps-pin__frame-corner apps-pin__frame-corner--tl" />
                  <span className="apps-pin__frame-corner apps-pin__frame-corner--tr" />
                  <span className="apps-pin__frame-corner apps-pin__frame-corner--bl" />
                  <span className="apps-pin__frame-corner apps-pin__frame-corner--br" />
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="apps-pin__hud">
          <div className="apps-pin__steps">
            {applicationItems.map((item, i) => (
              <AppStepIndicator
                key={item.title}
                index={i}
                activeMV={activeIndex}
                label={item.category}
              />
            ))}
          </div>
          <div className="apps-pin__bar">
            <motion.div className="apps-pin__bar-fill" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AppStepIndicator({ index, activeMV, label }) {
  const opacity = useTransform(activeMV, (v) => (v === index ? 1 : 0.35));
  const scale = useTransform(activeMV, (v) => (v === index ? 1 : 0.92));
  return (
    <motion.span className="apps-pin__step" style={{ opacity, scale }}>
      <span className="apps-pin__step-dot" />
      {label}
    </motion.span>
  );
}
