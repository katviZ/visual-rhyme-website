import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
