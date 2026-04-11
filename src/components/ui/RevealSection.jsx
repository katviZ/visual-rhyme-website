import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 80, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.section>
  );
}
