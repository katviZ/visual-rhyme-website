import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Showcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Headline grows from normal to giant as user scrolls through the section.
  const headlineScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.6, 2.8]);
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1],
    [0, 1, 1, 0]
  );

  // The color mesh behind the text drifts on both axes for parallax.
  const meshX = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const meshY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const meshRotate = useTransform(scrollYProgress, [0, 1], [0, 6]);

  // Kicker + subline fade in early, drift out near the end.
  const kickerOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.75, 0.9], [0, 1, 1, 0]);
  const kickerY = useTransform(scrollYProgress, [0.05, 0.2], [24, 0]);
  const sublineOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.75, 0.9], [0, 1, 1, 0]);
  const sublineY = useTransform(scrollYProgress, [0.15, 0.3], [24, 0]);

  return (
    <section ref={ref} className="showcase" style={{ height: '220vh' }}>
      <div className="showcase__sticky">
        <motion.div
          className="showcase__mesh"
          style={{ x: meshX, y: meshY, rotate: meshRotate }}
          aria-hidden="true"
        />
        <div className="showcase__scrim" aria-hidden="true" />

        <motion.span className="showcase__kicker" style={{ opacity: kickerOpacity, y: kickerY }}>
          — Between Science & Emotion
        </motion.span>

        <motion.h2
          className="showcase__headline"
          style={{ scale: headlineScale, opacity: headlineOpacity }}
        >
          Every Pixel
          <br />
          <span className="showcase__headline-stroke">Feels Alive</span>
        </motion.h2>

        <motion.p className="showcase__subline" style={{ opacity: sublineOpacity, y: sublineY }}>
          281 trillion colors. Zero compromise. Displays that don't just show an image —
          they become the room.
        </motion.p>
      </div>
    </section>
  );
}
