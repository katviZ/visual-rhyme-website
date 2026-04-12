import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'products', label: 'Products' },
  { id: 'technology', label: 'Technology' },
  { id: 'applications', label: 'Applications' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollRail() {
  const [activeId, setActiveId] = useState('hero');
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 900px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setVisible(true);

    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (!targets.length) return;

    const visibleRatios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let best = { id: activeId, ratio: 0 };
        visibleRatios.forEach((ratio, id) => {
          if (ratio > best.ratio) best = { id, ratio };
        });
        if (best.ratio > 0) setActiveId(best.id);
      },
      { threshold: [0.15, 0.35, 0.6, 0.85], rootMargin: '-10% 0px -40% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeId]);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!visible) return null;

  return (
    <motion.aside
      className="scroll-rail"
      aria-label="Section navigation"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="scroll-rail__track">
        <motion.div
          className="scroll-rail__fill"
          style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
        />
      </div>
      <ul className="scroll-rail__list">
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id} className="scroll-rail__item">
              <button
                type="button"
                className={`scroll-rail__btn${active ? ' scroll-rail__btn--active' : ''}`}
                onClick={() => handleClick(s.id)}
                aria-label={`Scroll to ${s.label}`}
                aria-current={active ? 'location' : undefined}
              >
                <span className="scroll-rail__dot" aria-hidden="true" />
                <span className="scroll-rail__label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.aside>
  );
}
