import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import LogoIcon from './LogoIcon';

const MIN_DURATION_MS = 1800;
const DIGITS = Array.from({ length: 101 }, (_, i) => i);

export default function Preloader() {
  const [done, setDone] = useState(false);

  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { damping: 30, stiffness: 90, mass: 0.6 });
  const reelY = useTransform(smooth, (v) => `${1 - v * 100}em`);
  const barScale = useTransform(smooth, (v) => v);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const start = performance.now();
    let rafId;

    const tick = () => {
      const elapsed = performance.now() - start;
      const loaded = document.readyState === 'complete';
      const timePct = Math.min(1, elapsed / MIN_DURATION_MS);
      const target = loaded ? timePct : Math.min(0.88, timePct * 0.95);
      progress.set(progress.get() + (target - progress.get()) * 0.12);

      if (loaded && elapsed >= MIN_DURATION_MS && progress.get() > 0.985) {
        progress.set(1);
        setTimeout(() => setDone(true), 520);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader__inner">
            <motion.div
              className="preloader__logo"
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LogoIcon size={64} color="#C084FC" />
            </motion.div>

            <div className="preloader__brand">
              <span className="preloader__brand-main">Visual</span>
              <span className="preloader__brand-accent">Rhyme</span>
            </div>

            <div className="preloader__counter" aria-hidden="true">
              <motion.div className="preloader__counter-reel" style={{ y: reelY }}>
                {DIGITS.map((n) => (
                  <div key={n} className="preloader__counter-row">
                    {String(n).padStart(3, '0')}
                  </div>
                ))}
              </motion.div>
              <span className="preloader__counter-suffix">%</span>
            </div>

            <div className="preloader__bar">
              <motion.div className="preloader__bar-fill" style={{ scaleX: barScale }} />
            </div>

            <div className="preloader__tagline">Engineering Emotions</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
