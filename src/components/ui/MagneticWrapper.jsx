import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticWrapper({
  children,
  outerStrength = 0.3,
  innerStrength = 0.25,
  maxDistance = 10,
  className = '',
  fullWidth = false,
}) {
  const display = fullWidth ? 'block' : 'inline-block';
  const width = fullWidth ? '100%' : undefined;
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  // Outer translation (moves the whole button)
  const outerX = useMotionValue(0);
  const outerY = useMotionValue(0);
  const outerSpringX = useSpring(outerX, { damping: 15, stiffness: 150, mass: 0.3 });
  const outerSpringY = useSpring(outerY, { damping: 15, stiffness: 150, mass: 0.3 });

  // Inner additional translation (content leads, creates parallax depth)
  const innerX = useMotionValue(0);
  const innerY = useMotionValue(0);
  const innerSpringX = useSpring(innerX, { damping: 12, stiffness: 180, mass: 0.2 });
  const innerSpringY = useSpring(innerY, { damping: 12, stiffness: 180, mass: 0.2 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(hoverMQ.matches && !reducedMQ.matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let rect = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      setActive(true);
    };

    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rawDx = e.clientX - cx;
      const rawDy = e.clientY - cy;

      const outerDx = rawDx * outerStrength;
      const outerDy = rawDy * outerStrength;
      outerX.set(Math.max(-maxDistance, Math.min(maxDistance, outerDx)));
      outerY.set(Math.max(-maxDistance, Math.min(maxDistance, outerDy)));

      const innerDx = rawDx * innerStrength;
      const innerDy = rawDy * innerStrength;
      const innerMax = maxDistance * 0.8;
      innerX.set(Math.max(-innerMax, Math.min(innerMax, innerDx)));
      innerY.set(Math.max(-innerMax, Math.min(innerMax, innerDy)));
    };

    const onLeave = () => {
      rect = null;
      outerX.set(0);
      outerY.set(0);
      innerX.set(0);
      innerY.set(0);
      setActive(false);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, outerStrength, innerStrength, maxDistance, outerX, outerY, innerX, innerY]);

  if (!enabled) {
    return <div className={`magnetic-wrapper ${className}`} style={{ display, width }}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrapper ${active ? 'is-active' : ''} ${className}`}
      style={{
        x: outerSpringX,
        y: outerSpringY,
        scale: active ? 1.025 : 1,
        display,
        width,
        transition: 'scale 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <motion.div
        style={{
          x: innerSpringX,
          y: innerSpringY,
          display,
          width,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
