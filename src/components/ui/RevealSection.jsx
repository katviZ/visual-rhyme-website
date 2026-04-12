import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';

export default function RevealSection({
  children,
  className = '',
  delay = 0,
  zoom = false,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.62, 1, 1, 0.7]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0.1]);
  const scale = useSpring(rawScale, { damping: 30, stiffness: 120, mass: 0.4 });
  const zoomOpacity = useSpring(rawOpacity, { damping: 30, stiffness: 120, mass: 0.4 });

  if (zoom && !reducedMotion) {
    return (
      <motion.section
        ref={ref}
        className={className}
        style={{
          ...style,
          scale,
          opacity: zoomOpacity,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: 1000, ...style }}
    >
      {children}
    </motion.section>
  );
}
