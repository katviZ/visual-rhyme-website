import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(hoverMQ.matches && !reducedMQ.matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mxPct = useMotionValue(50);
  const myPct = useMotionValue(50);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), { stiffness: 260, damping: 24 });

  const glowBg = useMotionTemplate`radial-gradient(circle at ${mxPct}% ${myPct}%, rgba(192, 132, 252, 0.22) 0%, rgba(147, 51, 234, 0.08) 30%, rgba(0, 0, 0, 0) 60%)`;
  const edgeBg = useMotionTemplate`radial-gradient(circle at ${mxPct}% ${myPct}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 45%)`;

  function handleMouse(e) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
    mxPct.set(px * 100);
    myPct.set(py * 100);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    mxPct.set(50);
    myPct.set(50);
  }

  if (!enabled) {
    return <div className={`tilt-card ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1400,
      }}
    >
      <motion.div
        className="tilt-card__glow"
        style={{ background: glowBg }}
        aria-hidden="true"
      />
      <motion.div
        className="tilt-card__edge"
        style={{ background: edgeBg }}
        aria-hidden="true"
      />
      <div className="tilt-card__content" style={{ transform: 'translateZ(40px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
