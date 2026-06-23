import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import LogoIcon from './ui/LogoIcon';
import MagneticWrapper from './ui/MagneticWrapper';
import LineReveal from './ui/LineReveal';
import SpecsTable from './SpecsTable';
import PitchCalculator from './PitchCalculator';

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
    moduleType: 'microled',
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
    moduleType: 'microled',
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
    moduleType: 'outdoor',
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
    moduleType: 'indoor',
  },
  {
    id: 'cob-module',
    name: 'COB Module 640×480',
    tagline: 'TrueHue COB — Mid-Tier MicroLED, Standard Cabinet',
    description: 'P1.2 Flip Chip COB on the universal 640×480mm cabinet. ≥10,000:1 static contrast, ≥300,000:1 dynamic, 95%+ DCI-P3 gamut, 14-bit grayscale, 3,840Hz refresh. Common Cathode standard with Common Anode configurable. Front-service, IP54.',
    specs: [
      { label: 'Pixel Pitch', value: '1.2 mm' },
      { label: 'Static Contrast', value: '≥10,000:1' },
      { label: 'Peak Brightness', value: '≤600 nits' },
      { label: 'Cabinet', value: '640 × 480 mm' },
    ],
    useCases: ['Mid-Tier Corporate', 'Premium Retail', 'Hospitality', 'Training Rooms'],
    gradient: 'linear-gradient(135deg, #14002A 0%, #4F2280 100%)',
    sceneColors: ['#5B2C8E', '#A855F7'],
    moduleType: 'microled',
  },
  {
    id: 'reyansh-flexible',
    name: 'Reyansh Flexible',
    tagline: 'TrueHue GOB — Curves, Columns, Arches',
    description: 'P2.0 Flexible PCB with GOB matte-black coating. Bends to R≥500mm radius for curved walls, columns, arches, interactive installs. 40-60% moiré reduction vs raw SMD, ≥8,000:1 static contrast, IP54-65. Magnetic or mechanical mounting, anti-reflective, anti-impact.',
    specs: [
      { label: 'Pixel Pitch', value: '2.0 mm' },
      { label: 'Bending Radius', value: '≥ R500 mm' },
      { label: 'Peak Brightness', value: '≤600 nits' },
      { label: 'Viewing Angle', value: '160° / 160°' },
    ],
    useCases: ['Curved Walls', 'Columns & Arches', 'Interactive Installs', 'Creative Retail'],
    gradient: 'linear-gradient(135deg, #170526 0%, #5C2A82 100%)',
    sceneColors: ['#7C3AED', '#9D5BC4'],
    moduleType: 'outdoor',
  },
  {
    id: 'leynna-sapphire-tv',
    name: 'Leynna Sapphire TV',
    tagline: 'TrueHue MicroLED — Furniture-Grade Integrated TV',
    description: 'Ready-made wall-mounted MicroLED televisions in 108", 136", and 163" diagonals. Sapphire substrate, Graviton Black surface, 281 trillion colors, 1,000,000:1 dynamic contrast, HDR10/HLG, Android or Android/Windows dual-boot, built-in 2×30W stereo, IP65 front.',
    specs: [
      { label: 'Sizes', value: '108" / 136" / 163"' },
      { label: 'Resolution', value: '1920 × 1080' },
      { label: 'Peak Brightness', value: '1,200 nits' },
      { label: 'HDR', value: 'HDR10 / HLG' },
    ],
    useCases: ['Luxury Residential', 'Private Cinemas', 'Premium Lounges', 'Executive Suites'],
    gradient: 'linear-gradient(135deg, #0E0020 0%, #6D1F9E 100%)',
    sceneColors: ['#9333EA', '#E9D5FF'],
    moduleType: 'microled',
  },
];

export default function Products({ onOpenQuote }) {
  const [activeProduct, setActiveProduct] = useState(0);

  return (
    <RevealSection className="products" delay={0}>
      <div id="products" className="products__inner">
        <span className="section-label">Our Products</span>
        <LineReveal as="h2" className="section-title">
          Displays That
          <span className="text-gradient"> Defy Ordinary</span>
        </LineReveal>

        <PitchCalculator />

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

        <div
          className="products__showcase"
          role="tabpanel"
          id={`product-panel-${products[activeProduct].id}`}
        >
          <div className="products__card">
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
                    Pixel Quote Max
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
                  <Suspense fallback={<LogoIcon size={60} color="rgba(147, 51, 234, 0.35)" />}>
                    <ProductScene
                      key={products[activeProduct].id}
                      gradient={products[activeProduct].sceneColors}
                      moduleType={products[activeProduct].moduleType}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SpecsTable />
      </div>
    </RevealSection>
  );
}
