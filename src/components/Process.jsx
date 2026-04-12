import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LineReveal from './ui/LineReveal';

const processSteps = [
  {
    step: '01',
    kicker: 'Discovery',
    title: 'Consult',
    description:
      'We listen to your vision, assess your space, and understand exactly what you need — product, size, environment, content.',
  },
  {
    step: '02',
    kicker: 'Engineering',
    title: 'Design',
    description:
      'Our engineers design a custom display solution — specs, layout, cabinet configuration, power planning, content strategy.',
  },
  {
    step: '03',
    kicker: 'Deployment',
    title: 'Install',
    description:
      'Professional installation by certified technicians. Expert calibration for brightness, chroma, and seamless edge matching.',
  },
  {
    step: '04',
    kicker: 'Lifetime',
    title: 'Support',
    description:
      'Up to 7 years of support with 3% spare modules included. Optional priority support and warranty extensions up to 5 years.',
  },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const n = processSteps.length;
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(n - 1) * 100}vw`]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(n - 1, Math.floor(v * n + 0.001))
  );

  return (
    <section
      ref={ref}
      id="process"
      className="process-pin"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="process-pin__sticky">
        <div className="process-pin__header">
          <span className="section-label">How We Work</span>
          <LineReveal as="h2" className="section-title">
            From Vision to
            <span className="text-gradient"> Reality in 4 Steps</span>
          </LineReveal>
        </div>

        <div className="process-pin__viewport">
          <motion.div className="process-pin__strip" style={{ x }}>
            {processSteps.map((s) => (
              <article key={s.step} className="process-pin__card">
                <div className="process-pin__number" aria-hidden="true">
                  {s.step}
                </div>
                <div className="process-pin__body">
                  <span className="process-pin__kicker">{s.kicker}</span>
                  <h3 className="process-pin__title">{s.title}</h3>
                  <p className="process-pin__desc">{s.description}</p>
                </div>
                <div className="process-pin__frame" aria-hidden="true">
                  <span className="process-pin__frame-corner process-pin__frame-corner--tl" />
                  <span className="process-pin__frame-corner process-pin__frame-corner--tr" />
                  <span className="process-pin__frame-corner process-pin__frame-corner--bl" />
                  <span className="process-pin__frame-corner process-pin__frame-corner--br" />
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="process-pin__hud">
          <div className="process-pin__steps">
            {processSteps.map((s, i) => (
              <ProcessStepIndicator key={s.step} index={i} activeMV={activeIndex} label={s.title} />
            ))}
          </div>
          <div className="process-pin__bar">
            <motion.div className="process-pin__bar-fill" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStepIndicator({ index, activeMV, label }) {
  const opacity = useTransform(activeMV, (v) => (v === index ? 1 : 0.35));
  const scale = useTransform(activeMV, (v) => (v === index ? 1 : 0.92));
  return (
    <motion.span className="process-pin__step" style={{ opacity, scale }}>
      <span className="process-pin__step-dot" />
      {label}
    </motion.span>
  );
}
