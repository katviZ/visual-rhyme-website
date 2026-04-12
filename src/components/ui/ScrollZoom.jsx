import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ScrollZoom({
  children,
  className = '',
  fromScale = 0.9,
  toScale = 1,
  fromOpacity = 0.55,
}) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!reducedMQ.matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [fromScale, toScale, toScale, fromScale + 0.02]
  );
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [fromOpacity, 1, 1, fromOpacity + 0.1]
  );

  const scale = useSpring(rawScale, { damping: 30, stiffness: 120, mass: 0.4 });
  const opacity = useSpring(rawOpacity, { damping: 30, stiffness: 120, mass: 0.4 });

  if (!enabled) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, opacity, transformOrigin: 'center center', willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
