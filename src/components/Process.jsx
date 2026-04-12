import { motion } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import LineReveal from './ui/LineReveal';

const processSteps = [
  {
    step: '01',
    title: 'Consult',
    description: 'We listen to your vision, assess your space, and understand exactly what you need — product, size, environment, content.',
  },
  {
    step: '02',
    title: 'Design',
    description: 'Our engineers design a custom display solution — specs, layout, cabinet configuration, power planning, content strategy.',
  },
  {
    step: '03',
    title: 'Install',
    description: 'Professional installation by certified technicians. Expert calibration for brightness, chroma, and seamless edge matching.',
  },
  {
    step: '04',
    title: 'Support',
    description: 'Up to 7 years of support with 3% spare modules included. Optional priority support and warranty extensions up to 5 years.',
  },
];

export default function Process() {
  return (
    <RevealSection className="process" zoom>
      <div id="process" className="process__inner">
        <span className="section-label">How We Work</span>
        <LineReveal as="h2" className="section-title">
          From Vision to
          <span className="text-gradient"> Reality in 4 Steps</span>
        </LineReveal>

        <div className="process__timeline">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              className="process__step"
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
            >
              <div className="process__step-number">{step.step}</div>
              <div className="process__step-content">
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-desc">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
