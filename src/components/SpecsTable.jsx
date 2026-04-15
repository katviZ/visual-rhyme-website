import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const families = [
  {
    id: 'reyansh-outdoor',
    label: 'Reyansh Outdoor',
    blurb: 'TrueHue MiniLED — brilliance under any sky. IP65, up to 11,000 nits, 4.4 trillion colors.',
    models: ['P6.67', 'P4', 'P2.5'],
    rows: [
      { label: 'Pixel Pitch', values: ['6.67 mm', '4.00 mm', '2.5 mm'] },
      { label: 'Cabinet Size', values: ['960 × 960 mm', '960 × 960 mm', '960 × 960 mm'] },
      { label: 'Cabinet Resolution', values: ['144 × 144', '240 × 240', '384 × 384'] },
      { label: 'Pixel Density', values: ['22,500 / m²', '62,500 / m²', '160,000 / m²'] },
      { label: 'Peak Brightness', values: ['Up to 11,000 nits', 'Up to 6,500 nits', 'Up to 6,000 nits'] },
      { label: 'Dynamic Contrast', values: ['250,000 : 1', '250,000 : 1', '250,000 : 1'] },
      { label: 'Color Reproduction', values: ['4.4 Trillion', '4.4 Trillion', '4.4 Trillion'] },
      { label: 'Refresh Rate', values: ['Up to 7680 Hz', 'Up to 7680 Hz', 'Up to 7680 Hz'] },
      { label: 'Frame Rate', values: ['Up to 120 Hz', 'Up to 120 Hz', 'Up to 120 Hz'] },
      { label: 'Naked-Eye 3D', values: ['X series', 'X series', 'X series'] },
      { label: 'Protection', values: ['IP65', 'IP65', 'IP65'] },
      { label: 'Warranty', values: ['Up to 5 Years', 'Up to 5 Years', 'Up to 5 Years'] },
    ],
  },
  {
    id: 'reyansh-indoor',
    label: 'Reyansh Indoor',
    blurb: 'TrueHue MiniLED indoor — where advertising meets art. Front-serviceable, passively cooled.',
    models: ['P2.5', 'P1.86', 'P1.56'],
    rows: [
      { label: 'Pixel Pitch', values: ['2.5 mm', '1.86 mm', '1.56 mm'] },
      { label: 'Cabinet Size', values: ['640 × 480 mm', '640 × 480 mm', '600 × 337.5 mm'] },
      { label: 'Cabinet Resolution', values: ['256 × 192', '320 × 180', '512 × 288'] },
      { label: 'Pixel Density', values: ['160,000 / m²', '~289,000 / m²', '~410,000 / m²'] },
      { label: 'Peak Brightness', values: ['Up to 1,000 nits', 'Up to 1,000 nits', 'Up to 1,000 nits'] },
      { label: 'Dynamic Contrast', values: ['250,000 : 1', '10,000 : 1', '300,000 : 1'] },
      { label: 'Color Reproduction', values: ['4.4 Trillion', '4.4 Trillion', '4.4 Trillion'] },
      { label: 'Refresh Rate', values: ['Up to 7680 Hz', '≥ 3840 Hz', '3840 Hz'] },
      { label: 'Technology', values: ['SMD / GOB', 'COB Flip-Chip', 'Flip Chip On Board'] },
      { label: 'Service Access', values: ['Front', 'Front', 'Front'] },
      { label: 'Protection', values: ['IP30 / IP65', 'IP65 (Indoor)', 'IP65 (Front)'] },
      { label: 'Warranty', values: ['Up to 5 Years', 'Up to 5 Years', 'Up to 5 Years'] },
    ],
  },
  {
    id: 'leynna',
    label: 'Leynna MicroLED',
    blurb: 'TrueHue MicroLED on sapphire substrate. 281 trillion colors, Graviton Black, HDR10/HLG.',
    models: ['Cosmo 1.17', 'Cosmo 0.93', 'Sapphire TV 108"', 'Sapphire TV 136"'],
    rows: [
      { label: 'Pixel Pitch', values: ['1.17 mm', '0.93 mm', '1.25 mm', '1.56 mm'] },
      { label: 'Substrate', values: ['Sapphire', 'Sapphire', 'Sapphire', 'Sapphire'] },
      { label: 'Pixel Engine', values: ['Dynamic', 'Dynamic', 'Sapphire', 'Sapphire'] },
      { label: 'Surface Treatment', values: ['Graviton Black', 'Graviton Black', 'Graviton Black', 'Graviton Black'] },
      { label: 'Resolution', values: ['512 × 288 / cab', '640 × 360 / cab', '1920 × 1080', '1920 × 1080'] },
      { label: 'Peak Brightness', values: ['1,200 nits', '1,200 nits', '1,200 nits', '1,200 nits'] },
      { label: 'Dynamic Contrast', values: ['300,000 : 1', '300,000 : 1', '1,000,000 : 1', '1,000,000 : 1'] },
      { label: 'Color Gamut', values: ['≥95% DCI-P3', '≥95% DCI-P3', '≥95% DCI-P3', '≥95% DCI-P3'] },
      { label: 'Color Reproduction', values: ['281 Trillion', '281 Trillion', '281 Trillion', '281 Trillion'] },
      { label: 'Bit Depth', values: ['16-bit', '16-bit', '48 bpp', '48 bpp'] },
      { label: 'Frame Rate', values: ['60 Hz', '60 Hz', 'Up to 120 Hz', 'Up to 120 Hz'] },
      { label: 'HDR Support', values: ['HDR10 / HLG', 'HDR10 / HLG', 'HDR10 / HLG', 'HDR10 / HLG'] },
      { label: 'Warranty', values: ['Up to 5 Years', 'Up to 5 Years', 'Up to 5 Years', 'Up to 5 Years'] },
    ],
  },
];

export default function SpecsTable() {
  const [active, setActive] = useState(0);
  const family = families[active];

  return (
    <div className="specs specs--inline">
      <div className="specs__inner">
        <div className="specs__header">
          <span className="specs__kicker">Technical Specifications</span>
          <h3 className="specs__title">
            Real specs. <span className="text-gradient">No marketing fluff.</span>
          </h3>
          <p className="specs__lede">
            Every value pulled straight from our engineering data sheets — the same
            numbers our install teams quote on site.
          </p>
        </div>

        <div className="specs__tabs" role="tablist" aria-label="Product families">
          {families.map((f, i) => (
            <motion.button
              key={f.id}
              className={`specs__tab ${i === active ? 'specs__tab--active' : ''}`}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              role="tab"
              aria-selected={i === active}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={family.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="specs__panel"
          >
            <p className="specs__blurb">{family.blurb}</p>

            <div className="specs__table-wrap" data-lenis-prevent>
              <table className="specs__table">
                <thead>
                  <tr>
                    <th className="specs__th-label">Specification</th>
                    {family.models.map((m) => (
                      <th key={m}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {family.rows.map((row, i) => (
                    <motion.tr
                      key={row.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <td className="specs__td-label">{row.label}</td>
                      {row.values.map((v, j) => (
                        <td key={j}>{v}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="specs__footnote">
              All specifications are subject to the product data sheet. Custom cabinet sizes
              and configurations available on request — contact our experience center in Ahmedabad.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
