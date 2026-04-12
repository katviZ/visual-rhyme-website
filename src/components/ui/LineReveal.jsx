import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LineReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.1,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (reduced) return <Tag ref={ref} className={className}>{children}</Tag>;

  return (
    <Tag ref={ref} className={`line-reveal ${className}`}>
      <motion.span
        className="line-reveal__inner"
        initial={{ y: '110%' }}
        animate={inView ? { y: '0%' } : { y: '110%' }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
