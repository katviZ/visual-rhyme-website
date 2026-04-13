import { lazy, Suspense } from 'react';
import RevealSection from './ui/RevealSection';
import LineReveal from './ui/LineReveal';
import ClipReveal from './ui/ClipReveal';
import MagneticWrapper from './ui/MagneticWrapper';

const FloatingGeo = lazy(() => import('./three/FloatingGeo'));

const DiamondIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2.7 10.3l8.6 10.8a1 1 0 001.4 0l8.6-10.8a1 1 0 00.1-1.1l-3.5-6A1 1 0 0017 2.7H7a1 1 0 00-.9.5l-3.5 6a1 1 0 00.1 1.1z" stroke="var(--purple-400)"/>
    <path d="M2 10h20M8.5 2.7L6 10l6 11M15.5 2.7L18 10l-6 11M12 2.7V10" stroke="var(--purple-400)" strokeOpacity="0.5"/>
  </svg>
);

const ContrastIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-400)" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M12 3v18" strokeOpacity="0.5"/>
    <rect x="3" y="3" width="9" height="18" rx="3" fill="var(--purple-400)" fillOpacity="0.15"/>
  </svg>
);

const GearIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-400)" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-400)" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2a5 5 0 00-4.78 3.5A4 4 0 004 9.5a4.5 4.5 0 00.5 8.5h1A5 5 0 0012 22"/>
    <path d="M12 2a5 5 0 014.78 3.5A4 4 0 0120 9.5a4.5 4.5 0 01-.5 8.5h-1A5 5 0 0112 22"/>
    <path d="M12 2v20" strokeOpacity="0.3" strokeDasharray="2 2"/>
    <circle cx="9" cy="10" r="1" fill="var(--purple-400)"/>
    <circle cx="15" cy="10" r="1" fill="var(--purple-400)"/>
  </svg>
);

const PaletteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-400)" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8" cy="9" r="1.5" fill="#A855F7"/>
    <circle cx="15" cy="8" r="1.5" fill="#C084FC"/>
    <circle cx="16.5" cy="13" r="1.5" fill="#E9D5FF"/>
    <circle cx="9" cy="14" r="1.5" fill="#7C3AED"/>
    <path d="M6 18.5C8 21 14 21 17 17" strokeOpacity="0.3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-400)" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2l8 4v5c0 5.25-3.5 10-8 11.5C7.5 21 4 16.25 4 11V6l8-4z"/>
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const techFeatures = [
  {
    icon: <DiamondIcon />,
    title: 'TrueHue MicroLED',
    description: 'Strict wavelength and intensity tolerances during production ensure unmatched picture quality with consistent color across every pixel.',
  },
  {
    icon: <ContrastIcon />,
    title: 'Graviton Black',
    description: 'A proprietary surface treatment and encapsulation process that achieves high light absorption for deeper, truer blacks and enhanced contrast.',
  },
  {
    icon: <GearIcon />,
    title: 'Sapphire Pixel Engine',
    description: 'A blend of hardware, algorithms, and image processing that extracts the absolute best visuals from each pixel on our Leynna Sapphire series.',
  },
  {
    icon: <BrainIcon />,
    title: 'Dynamic Pixel Engine',
    description: 'An intelligent subpixel management system on Leynna Cosmo that achieves higher resolutions with fewer semiconductors — sustainable by design.',
  },
  {
    icon: <PaletteIcon />,
    title: '95%+ DCI-P3 Coverage',
    description: 'Our MicroLED displays surpass DCI-P3 and Rec2020 color standards. 65x more shades per color than OLED — 281 trillion colors total.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Up to 5-Year Warranty',
    description: 'Standard 2-3 year warranty extendable up to 5 years. 3% spare modules included. Up to 7 years of support with optional priority support.',
  },
];

export default function Technology() {
  return (
    <RevealSection className="why-us" style={{ position: 'relative' }} zoom>
      <Suspense fallback={null}>
        <FloatingGeo variant="tech" />
      </Suspense>
      <div id="technology" className="why-us__inner" style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-label">Technology & Features</span>
        <LineReveal as="h2" className="section-title">
          Engineered with
          <span className="text-gradient"> Proprietary Innovation</span>
        </LineReveal>
        <p className="section-subtitle">
          Every component, every algorithm, every surface treatment — designed in-house
          to deliver visuals no one else can.
        </p>

        <div className="why-us__grid">
          {techFeatures.map((item, i) => (
            <MagneticWrapper key={item.title} subtle fullWidth>
              <ClipReveal
                className="why-us__card"
                delay={i * 0.12}
                duration={1.15}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <span className="why-us__icon">{item.icon}</span>
                <h3 className="why-us__card-title">{item.title}</h3>
                <p className="why-us__card-desc">{item.description}</p>
              </ClipReveal>
            </MagneticWrapper>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
