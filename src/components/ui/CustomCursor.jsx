import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .btn, .products__tab, .navbar__link, input, textarea, select, label';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dot: no spring — tracks mouse 1:1 for pixel-perfect instant feel
  const ringX = useSpring(cursorX, { damping: 22, stiffness: 180, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 22, stiffness: 180, mass: 0.5 });

  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    const shouldEnable = hoverMQ.matches && !reducedMotionMQ.matches;
    setEnabled(shouldEnable);

    if (!shouldEnable) return;

    document.body.classList.add('custom-cursor-active');

    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onEnter = () => {
      if (ringRef.current) ringRef.current.classList.add('custom-cursor__ring--hover');
    };
    const onLeave = () => {
      if (ringRef.current) ringRef.current.classList.remove('custom-cursor__ring--hover');
    };

    const attachHoverListeners = () => {
      document.querySelectorAll(INTERACTIVE_SELECTOR).forEach((el) => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachHoverListeners();

    const observer = new MutationObserver(() => attachHoverListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      document.body.classList.remove('custom-cursor-active');
      document.querySelectorAll('[data-cursor-bound]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        delete el.dataset.cursorBound;
      });
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="custom-cursor__dot"
        style={{ translateX: cursorX, translateY: cursorY }}
        aria-hidden="true"
      />
      <motion.div
        ref={ringRef}
        className="custom-cursor__ring"
        style={{ translateX: ringX, translateY: ringY }}
        aria-hidden="true"
      />
    </>
  );
}
