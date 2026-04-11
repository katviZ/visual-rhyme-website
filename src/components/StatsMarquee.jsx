import { motion } from 'framer-motion';

const stats = [
  '281 Trillion Colors',
  '6,000 nits Brightness',
  '1,000,000:1 Contrast',
  'TrueHue MicroLED',
  'Sapphire Substrate',
  'Graviton Black',
  'Up to 7680 Hz Refresh',
  'HDR10 / HLG',
  'Up to 5-Year Warranty',
  'Made in India',
  '281 Trillion Colors',
  '6,000 nits Brightness',
  '1,000,000:1 Contrast',
  'TrueHue MicroLED',
];

export default function StatsMarquee() {
  return (
    <div className="marquee-section" aria-label="Key specifications">
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {stats.map((stat, i) => (
          <span key={i} className="marquee-item">
            {stat} <span className="marquee-dot" aria-hidden="true">&#9670;</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
