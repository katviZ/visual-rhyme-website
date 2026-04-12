import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .btn, .products__tab, .navbar__link, input, textarea, select, label';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const ringX = useSpring(cursorX, { damping: 22, stiffness: 180, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 22, stiffness: 180, mass: 0.5 });

  // Scroll-velocity driven stretch
  const velRaw = useMotionValue(0);
  const velSmooth = useSpring(velRaw, { damping: 26, stiffness: 220, mass: 0.4 });
  const ringScaleY = useTransform(velSmooth, (v) => 1 + Math.min(Math.abs(v), 1) * 1.5);
  const ringScaleX = useTransform(velSmooth, (v) => 1 - Math.min(Math.abs(v), 1) * 0.55);
  const dotScaleY = useTransform(velSmooth, (v) => 1 + Math.min(Math.abs(v), 1) * 1.0);
  const dotScaleX = useTransform(velSmooth, (v) => 1 - Math.min(Math.abs(v), 1) * 0.4);

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

    // Scroll-velocity tracking
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let rafId;

    const tick = () => {
      const now = performance.now();
      const dt = now - lastTime;
      const dy = window.scrollY - lastScrollY;
      if (dt > 0) {
        // px/ms normalized — a fast scroll is ~3-5 px/ms
        const instant = Math.max(-1, Math.min(1, dy / dt / 2.2));
        // Bias toward the larger of (instant, current * decay) so we ramp quickly, decay gently
        const decayed = velRaw.get() * 0.93;
        velRaw.set(Math.abs(instant) > Math.abs(decayed) ? instant : decayed);
      }
      lastScrollY = window.scrollY;
      lastTime = now;
      document.documentElement.style.setProperty('--scroll-v', String(velRaw.get().toFixed(4)));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty('--scroll-v');
      document.body.classList.remove('custom-cursor-active');
      document.querySelectorAll('[data-cursor-bound]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        delete el.dataset.cursorBound;
      });
    };
  }, [cursorX, cursorY, velRaw]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="custom-cursor__dot"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          scaleX: dotScaleX,
          scaleY: dotScaleY,
        }}
        aria-hidden="true"
      />
      <motion.div
        ref={ringRef}
        className="custom-cursor__ring"
        style={{
          translateX: ringX,
          translateY: ringY,
          scaleX: ringScaleX,
          scaleY: ringScaleY,
        }}
        aria-hidden="true"
      />
    </>
  );
}
