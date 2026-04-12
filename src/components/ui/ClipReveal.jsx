import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Diagonal clip-path unmask. Starts collapsed into the bottom-left corner and
// expands outward along the diagonal — Lusion-style wipe.
const HIDDEN = 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)';
const SHOWN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

export default function ClipReveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  duration = 1.1,
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const MotionTag = motion[Tag] || motion.div;

  if (reducedMotion) {
    return (
      <Tag ref={ref} className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ clipPath: HIDDEN, WebkitClipPath: HIDDEN, ...style }}
      animate={inView ? { clipPath: SHOWN, WebkitClipPath: SHOWN } : {}}
      transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
