import { motion } from 'framer-motion';
import RevealSection from './ui/RevealSection';

const applicationItems = [
  {
    title: 'Board & Meeting Rooms',
    category: 'Corporate',
    description: 'Leynna Cosmo & Sapphire MicroLED walls for boardrooms that command attention.',
  },
  {
    title: 'Stadiums & Arenas',
    category: 'Outdoor',
    description: 'Reyansh Outdoor P3/P4/P6 — up to 11,000 nits for daylight-visible spectacles.',
  },
  {
    title: 'Luxury Residences',
    category: 'Premium',
    description: 'Leynna Sapphire TV — 108" to 163" MicroLED TVs for ultra-premium homes.',
  },
  {
    title: 'Indoor DOOH Advertising',
    category: 'Retail',
    description: 'Reyansh Indoor with cloud CMS — seamless content management for malls and airports.',
  },
  {
    title: 'Control & Command Centers',
    category: 'Mission Critical',
    description: 'High-refresh, low-latency Leynna Cosmo displays for 24/7 monitoring operations.',
  },
  {
    title: 'Experience Centers & Museums',
    category: 'Immersive',
    description: 'Sapphire MicroLED with HDR10/HLG for immersive, life-like visual storytelling.',
  },
];

export default function Applications() {
  return (
    <RevealSection className="portfolio">
      <div id="applications" className="portfolio__inner">
        <span className="section-label">Applications</span>
        <h2 className="section-title">
          Built For Spaces That
          <span className="text-gradient"> Demand Extraordinary</span>
        </h2>
        <p className="section-subtitle">
          From daylight-visible outdoor billboards to ultra-premium living rooms — our
          displays are engineered for every environment.
        </p>

        <div className="portfolio__grid">
          {applicationItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="portfolio__item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <div className="portfolio__image-placeholder">
                <span>{item.category}</span>
              </div>
              <div className="portfolio__item-overlay">
                <span className="portfolio__item-category">{item.category}</span>
                <h3 className="portfolio__item-title">{item.title}</h3>
                <p className="portfolio__item-desc">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
