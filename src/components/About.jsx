import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import AnimatedCounter from './ui/AnimatedCounter';
import LogoIcon from './ui/LogoIcon';
import LineReveal from './ui/LineReveal';

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <RevealSection className="about" delay={0} zoom>
      <div id="about" className="about__inner" ref={ref}>
        <div className="about__text">
          <motion.span className="section-label">Our Story</motion.span>
          <LineReveal as="h2" className="section-title">
            Born From a Vision to
            <span className="text-gradient"> Redefine Display</span>
          </LineReveal>
          <p className="about__description">
            Visual Rhyme was founded in 2025 with a singular obsession — to bring
            world-class MicroLED and MiniLED technology to India. We saw a market
            flooded with generic screens and zero engineering soul. So we built
            something different.
          </p>
          <p className="about__description">
            From our proprietary TrueHue MicroLED chips on sapphire substrates to
            our Graviton Black surface treatment for unmatched contrast — every
            display we create is engineered to stop people in their tracks. From
            Ahmedabad's experience center to installations across the country,
            we're rewriting what "digital display" means in India.
          </p>

          <div className="about__stats">
            <div className="about__stat">
              <span className="about__stat-number">
                <AnimatedCounter target={281} suffix="T" />
              </span>
              <span className="about__stat-label">Colors Rendered</span>
            </div>
            <div className="about__stat">
              <span className="about__stat-number">
                <AnimatedCounter target={6000} />
              </span>
              <span className="about__stat-label">nits Peak Brightness</span>
            </div>
            <div className="about__stat">
              <span className="about__stat-number">
                <AnimatedCounter target={100} suffix="K+" />
              </span>
              <span className="about__stat-label">Hours LED Lifespan</span>
            </div>
          </div>
        </div>

        <motion.div className="about__visual" style={{ y: imgY }}>
          <div className="about__image-placeholder">
            <div className="about__image-glow" />
            <LogoIcon size={120} color="rgba(147, 51, 234, 0.15)" />
          </div>
        </motion.div>
      </div>
    </RevealSection>
  );
}
