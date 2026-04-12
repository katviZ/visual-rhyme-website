import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import TiltCard from './ui/TiltCard';
import LogoIcon from './ui/LogoIcon';
import MagneticWrapper from './ui/MagneticWrapper';
import LineReveal from './ui/LineReveal';

const ProductScene = lazy(() => import('./three/ProductScene'));

const products = [
  {
    id: 'leynna-sapphire',
    name: 'Leynna Sapphire',
    tagline: 'MicroLED — Mesmerizing Visuals for Luxury Spaces',
    description: 'Our flagship MicroLED display built on sapphire substrate with the Sapphire Pixel Engine. 281 trillion colors, 1,000,000:1 dynamic contrast, Graviton Black surface treatment, and HDR10/HLG support. Available as custom panels or ready-made TVs (108" to 163", up to 4K).',
    specs: [
      { label: 'Colors', value: '281 Trillion' },
      { label: 'Contrast', value: '1,000,000:1' },
      { label: 'Peak Brightness', value: '1,200 nits' },
      { label: 'Color Gamut', value: '95%+ DCI-P3' },
    ],
    useCases: ['Luxury Residences', 'Boardrooms', 'Experience Centers', 'Museums'],
    gradient: 'linear-gradient(135deg, #1A0025 0%, #5B2C8E 50%, #7C3AED 100%)',
    sceneColors: ['#7C3AED', '#C084FC'],
  },
  {
    id: 'leynna-cosmo',
    name: 'Leynna Cosmo',
    tagline: 'MicroLED — Mesmerizing Visuals for Every Setting',
    description: 'Commercial-grade MicroLED with Dynamic Pixel Engine — an intelligent subpixel management system that achieves high resolutions with fewer semiconductors. Flip Chip On Board manufacturing, 281 trillion colors, 300,000:1 dynamic contrast, and Graviton Black.',
    specs: [
      { label: 'Colors', value: '281 Trillion' },
      { label: 'Contrast', value: '300,000:1' },
      { label: 'Peak Brightness', value: '1,200 nits' },
      { label: 'Pixel Pitch', value: 'From 0.78mm' },
    ],
    useCases: ['Corporate Lobbies', 'Control Centers', 'Branding Walls', 'Indoor DOOH'],
    gradient: 'linear-gradient(135deg, #2D0A4E 0%, #7B2FBE 100%)',
    sceneColors: ['#9333EA', '#A855F7'],
  },
  {
    id: 'reyansh-outdoor',
    name: 'Reyansh Outdoor',
    tagline: 'TrueHue MiniLED — Brilliance Under Any Sky',
    description: 'Available in P3, P4, and P6 series (each with standard, S, and X tiers). Up to 11,000 nits peak brightness, 250,000:1 dynamic contrast, 4,396 billion colors, IP65 rated, 85%+ Rec2020 coverage. The X series adds Nationstar LEDs, gold contacts, and naked-eye 3D readiness.',
    specs: [
      { label: 'Peak Brightness', value: 'Up to 11,000 nits' },
      { label: 'Colors', value: '4,396 Billion' },
      { label: 'Refresh Rate', value: 'Up to 7680 Hz' },
      { label: 'Protection', value: 'IP65' },
    ],
    useCases: ['Stadiums & Arenas', 'Highway Billboards', 'Concert Stages', 'Building Facades'],
    gradient: 'linear-gradient(135deg, #1a0533 0%, #6C3483 100%)',
    sceneColors: ['#6C3483', '#A855F7'],
  },
  {
    id: 'reyansh-indoor',
    name: 'Reyansh Indoor',
    tagline: 'TrueHue MiniLED — Where Advertising Meets Art',
    description: 'P1.86 and P2.5 series with SMD and Glue-on-Board (GOB) variants. Up to 1,000 nits peak brightness, 250,000:1 dynamic contrast, 4,396 billion colors. Passively cooled, front-serviceable panels with cloud-based CMS for seamless DOOH advertising.',
    specs: [
      { label: 'Peak Brightness', value: 'Up to 1,000 nits' },
      { label: 'Colors', value: '4,396 Billion' },
      { label: 'Frame Rate', value: 'Up to 120 Hz' },
      { label: 'Control', value: 'Cloud CMS' },
    ],
    useCases: ['Shopping Malls', 'Airport Lounges', 'Hotel Lobbies', 'Showrooms'],
    gradient: 'linear-gradient(135deg, #0D0015 0%, #4A148C 100%)',
    sceneColors: ['#4A148C', '#9333EA'],
  },
];

export default function Products({ onOpenQuote }) {
  const [activeProduct, setActiveProduct] = useState(0);

  return (
    <RevealSection className="products" delay={0} zoom>
      <div id="products" className="products__inner">
        <span className="section-label">Our Products</span>
        <LineReveal as="h2" className="section-title">
          Displays That
          <span className="text-gradient"> Defy Ordinary</span>
        </LineReveal>

        <div className="products__tabs" role="tablist" aria-label="Product categories">
          {products.map((p, i) => (
            <motion.button
              key={p.id}
              className={`products__tab ${i === activeProduct ? 'products__tab--active' : ''}`}
              onClick={() => setActiveProduct(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              role="tab"
              aria-selected={i === activeProduct}
              aria-controls={`product-panel-${p.id}`}
            >
              {p.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct}
            className="products__showcase"
            initial={{ opacity: 0, y: 40, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            exit={{ opacity: 0, y: -40, rotateY: 10 }}
            transition={{ duration: 0.5 }}
            style={{ perspective: 1200 }}
            role="tabpanel"
            id={`product-panel-${products[activeProduct].id}`}
          >
            <TiltCard className="products__card">
              <div className="products__card-bg" style={{ background: products[activeProduct].gradient }} />
              <div className="products__card-content">
                <div className="products__card-left">
                  <h3 className="products__card-name">{products[activeProduct].name}</h3>
                  <p className="products__card-tagline">{products[activeProduct].tagline}</p>
                  <p className="products__card-desc">{products[activeProduct].description}</p>

                  <div className="products__use-cases">
                    <h4>Ideal For:</h4>
                    <div className="products__use-case-tags">
                      {products[activeProduct].useCases.map((uc) => (
                        <span key={uc} className="products__use-case-tag">{uc}</span>
                      ))}
                    </div>
                  </div>

                  <MagneticWrapper>
                    <button className="btn btn--primary" onClick={onOpenQuote}>
                      Pixel Quote Pro
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </MagneticWrapper>
                </div>

                <div className="products__card-right">
                  <div className="products__specs">
                    {products[activeProduct].specs.map((spec) => (
                      <div key={spec.label} className="products__spec">
                        <span className="products__spec-value">{spec.value}</span>
                        <span className="products__spec-label">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="products__image-placeholder">
                    <Suspense fallback={<LogoIcon size={60} color="rgba(147, 51, 234, 0.2)" />}>
                      <ProductScene gradient={products[activeProduct].sceneColors} />
                    </Suspense>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </RevealSection>
  );
}
