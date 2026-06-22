import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const families = [
  {
    id: 'leynna-real',
    label: 'Leynna Real Pixel',
    blurb: 'Flip Chip COB · dedicated R/G/B per pixel · reference-grade MicroLED. Used for broadcast, XR/VP, executive boardrooms, and luxury retail flagships.',
    shared: [
      ['Technology',   'Flip Chip COB · Real Pixel'],
      ['Architecture', 'Common Cathode (std) · Common Anode (opt)'],
      ['Substrate',    'Sapphire · Graviton Black'],
      ['Bin Tier',     'Premium (1-2 bin)'],
      ['Wavelength',   'G ±2nm · B ±3nm · R ±5nm'],
      ['Cabinet',      '600 × 337.5 × 44.5 mm · 4.8 kg'],
      ['Service',      'Front · Wire-Free'],
      ['IP / Calib.',  'IP65 Front · 5-Layer · D65'],
      ['HDR / Life',   'HDR10 / HLG · 100,000 hrs'],
      ['Warranty',     '3 yr std · Up to 5 yr · 5% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P0.78', code: 'MCBP008 Pro S',  tag: 'Reference',       specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<2 avg · <4 max'],['Viewing Angle','170° / 170°'],['MVD','2.68 m'],['OVD','1.56 – 2.34 m'],['Retinal Distance','5.36 m']] },
      { pitch: 'P0.93', code: 'MCBP009 Pro S',  tag: 'Broadcast',       specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<2 avg · <4 max'],['Viewing Angle','170° / 170°'],['MVD','3.20 m'],['OVD','1.86 – 2.79 m'],['Retinal Distance','6.39 m']] },
      { pitch: 'P1.17', code: 'Custom COB',     tag: 'Premium',         specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<2 avg · <4 max'],['Viewing Angle','170° / 170°'],['MVD','4.02 m'],['OVD','2.34 – 3.51 m'],['Retinal Distance','8.04 m']] },
      { pitch: 'P1.25', code: 'MCBP012 Pro S',  tag: 'Entry Premium',   specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<2 avg · <4 max'],['Viewing Angle','170° / 170°'],['MVD','4.30 m'],['OVD','2.50 – 3.75 m'],['Retinal Distance','8.60 m']] },
      { pitch: 'P1.56', code: 'MCBP015 Pro S',  tag: 'Premium',         specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<2 avg · <4 max'],['Viewing Angle','170° / 170°'],['MVD','5.36 m'],['OVD','3.12 – 4.68 m'],['Retinal Distance','10.73 m']] },
      { pitch: 'P1.86', code: 'MCUP018 Pro S',  tag: '22-bit Flagship', highlight: true, specs: [['Bit Depth','22-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','20,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','7,680 Hz'],['Driver IC','XM Plus 11206 (Hybrid PWM+PAM)'],['Color Gamut','NTSC ≥115% · DCI-P3 ≥95%'],['Delta E (ΔE)','<2 avg · <4 max (Broadcast)'],['Viewing Angle','170° / 170°'],['MVD','6.39 m'],['OVD','3.72 – 5.58 m'],['Retinal Distance','12.79 m']] },
    ],
  },
  {
    id: 'leynna-virtual',
    label: 'Leynna Virtual Pixel',
    blurb: 'RCBP subpixel-sharing architecture · 40% lower cost than equivalent real-pixel pitch · ideal for close-view creative content where apparent resolution matters more than 1:1 fidelity.',
    shared: [
      ['Technology',   'Flip Chip COB · Virtual Pixel (RCBP)'],
      ['Architecture', 'Common Cathode (std) · Common Anode (opt)'],
      ['Substrate',    'Sapphire · Graviton Black'],
      ['Bin Tier',     'Premium (1-2 bin)'],
      ['Cabinet',      '600 × 337.5 × 44.5 mm · 4.8 kg'],
      ['Service',      'Front · Wire-Free'],
      ['IP / Calib.',  'IP65 Front · 5-Layer · D65'],
      ['HDR / Life',   'HDR10 / HLG · 100,000 hrs'],
      ['Warranty',     '3 yr std · Up to 5 yr · 5% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P0.78 V', code: 'RCBP008', tag: 'Virtual Reference', virtual: '~0.39 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','2.68 m'],['Virtual MVD','1.34 m'],['Retinal Distance','5.36 m']] },
      { pitch: 'P0.93 V', code: 'RCBP009', tag: 'Virtual Premium',   virtual: '~0.47 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','3.20 m'],['Virtual MVD','1.62 m'],['Retinal Distance','6.39 m']] },
      { pitch: 'P1.17 V', code: 'RCBP012', tag: 'Virtual Corporate', virtual: '~0.59 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','4.02 m'],['Virtual MVD','2.01 m'],['Retinal Distance','8.04 m']] },
    ],
  },
  {
    id: 'reyansh-indoor-micro',
    label: 'Reyansh Indoor MicroLED',
    blurb: 'Entry-grade MicroLED on COB flip-chip · premium feel at Reyansh pricing · built for corporate MicroLED and premium retail installations.',
    shared: [
      ['Technology',   'Flip Chip COB'],
      ['Architecture', 'Common Cathode (std) · Common Anode (opt)'],
      ['Substrate',    'Sapphire · Graviton Black'],
      ['Cabinet',      '600 × 337.5 × 44.5 mm'],
      ['Service',      'Front'],
      ['IP / Calib.',  'IP65 Front · 5-Layer · D65'],
      ['HDR / Life',   'HDR10 / HLG · 100,000 hrs'],
      ['Warranty',     '3 yr std · Up to 5 yr'],
    ],
    skus: [
      { pitch: 'P1.56', code: 'RCM156 COB', tag: 'Entry MicroLED', specs: [['Bit Depth','16-bit'],['Peak Brightness','1,200 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥300,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg'],['Viewing Angle','170° / 170°'],['MVD','5.36 m'],['OVD','3.12 – 4.68 m'],['Retinal Distance','10.73 m']] },
    ],
  },
  {
    id: 'reyansh-indoor-mini',
    label: 'Reyansh Indoor MiniLED',
    blurb: 'SMD and GOB packaging · front-serviceable · 640 × 480 mm cabinet · the Indian corporate / retail / event workhorse.',
    shared: [
      ['Technology',   'SMD / GOB'],
      ['Architecture', 'Common Anode (std) · Common Cathode (opt)'],
      ['LED Type',     'TrueHue MiniLED'],
      ['Bin Tier',     'Standard to High (2-3 bin)'],
      ['Cabinet',      '640 × 480 × 75 mm'],
      ['Service',      'Front or Rear'],
      ['IP / Calib.',  'IP30-54 · 5-Layer · D65'],
      ['HDR / Life',   'HDR10 · ~100,000 hrs'],
      ['Warranty',     '2 yr std · Up to 5 yr'],
    ],
    skus: [
      { pitch: 'P1.25', code: 'SMD / GOB', tag: 'Fine Pitch', specs: [['Bit Depth','14-bit'],['Peak Brightness','700 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<5 avg'],['Viewing Angle','160° / 160°'],['MVD','4.30 m'],['OVD','2.50 – 3.75 m'],['Retinal Distance','8.60 m']] },
      { pitch: 'P1.56', code: 'SMD / GOB', tag: 'Fine Pitch', specs: [['Bit Depth','14-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<5 avg'],['Viewing Angle','160° / 160°'],['MVD','5.36 m'],['OVD','3.12 – 4.68 m'],['Retinal Distance','10.73 m']] },
      { pitch: 'P1.86', code: 'SMD / GOB', tag: 'Mid-Range',  specs: [['Bit Depth','14-bit'],['Peak Brightness','600 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<5 avg'],['Viewing Angle','160° / 160°'],['MVD','6.39 m'],['OVD','3.72 – 5.58 m'],['Retinal Distance','12.79 m']] },
      { pitch: 'P2.5',  code: 'SMD / GOB', tag: 'Volume',     specs: [['Bit Depth','14-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<5 avg'],['Viewing Angle','160° / 160°'],['MVD','8.60 m'],['OVD','5.00 – 7.50 m'],['Retinal Distance','17.19 m']] },
    ],
  },
  {
    id: 'reyansh-outdoor',
    label: 'Reyansh Outdoor',
    blurb: 'TrueHue MiniLED · IP65 · up to 11,000 nits peak on X-variant · 960×960 or 640×640 cabinet · X-series adds Nationstar LEDs, gold contacts, naked-eye 3D.',
    shared: [
      ['Technology',   'SMD IP65'],
      ['Architecture', 'Common Anode (std) · Common Cathode (opt)'],
      ['LED Type',     'TrueHue MiniLED (SMD3535)'],
      ['Bin Tier',     'Standard / High / Premium (1-3 bin)'],
      ['Cabinet',      '960×960 or 640×640 · 75 mm depth'],
      ['Service',      'Rear or Front*'],
      ['IP / Calib.',  'IP65 Front · IP54 Rear · 5-Layer'],
      ['HDR / Life',   'HDR10 · 100,000 hrs'],
      ['Warranty',     '2 yr std · Up to 5 yr on X-variant'],
    ],
    skus: [
      { pitch: 'P2.5',    code: 'SMD IP65',      tag: 'Fine Outdoor',       specs: [['Bit Depth','14-bit'],['Peak Brightness','5,000 nits'],['Static Contrast','≥8,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Frame Rate','Up to 120 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<4 avg (S/X)'],['Viewing Angle','155° / 155°'],['MVD','8.60 m'],['Retinal Distance','17.19 m']] },
      { pitch: 'P3.076',  code: 'SMD IP65',      tag: 'Premium DOOH',       specs: [['Bit Depth','14-bit'],['Peak Brightness','5,500 nits'],['Static Contrast','≥8,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Frame Rate','Up to 120 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<4 avg (S/X)'],['Viewing Angle','155° / 155°'],['MVD','10.58 m'],['Retinal Distance','21.15 m']] },
      { pitch: 'P4.0',    code: 'SMD IP65',      tag: 'DOOH Standard',      specs: [['Bit Depth','14-bit'],['Peak Brightness','6,000 nits'],['Static Contrast','≥8,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','Up to 7,680 Hz'],['Frame Rate','Up to 120 Hz'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<4 avg (S/X)'],['Viewing Angle','155° / 155°'],['MVD','13.75 m'],['Retinal Distance','27.50 m']] },
      { pitch: 'P6.67 X', code: 'Nationstar · Hybrid PWM+PAM', tag: '11K nits · Billboard', highlight: true, specs: [['Bit Depth','14-bit'],['Peak Brightness','11,000 nits'],['Static Contrast','≥8,000:1'],['Dynamic Contrast','≥250,000:1'],['Refresh Rate','7,680 Hz'],['Frame Rate','120 Hz · Naked-eye 3D'],['Driver IC','TBS5266A (Hybrid PWM+PAM)'],['Color Gamut','≥110% sRGB'],['Delta E (ΔE)','<3 avg'],['Viewing Angle','155° / 155°'],['MVD','22.93 m'],['Retinal Distance','45.86 m']] },
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
            18 configurations. <span className="text-gradient">Five product families.</span>
          </h3>
          <p className="specs__lede">
            Every SKU below carries the full engineering specification —
            driver IC, architecture, calibration Delta E, and arc-minute viewing geometry.
            Pulled straight from our data sheets.
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
              <span className="specs__tab-count">{f.skus.length}</span>
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

            <div className="specs__shared">
              <div className="specs__shared-head">
                <span className="specs__shared-label">Common to every SKU in this family</span>
              </div>
              <div className="specs__shared-grid">
                {family.shared.map(([label, value]) => (
                  <div key={label} className="specs__shared-spec">
                    <span className="specs__shared-key">{label}</span>
                    <span className="specs__shared-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`specs__sku-grid ${family.skus.length === 1 ? 'specs__sku-grid--single' : ''}`}>
              {family.skus.map((sku, i) => (
                <motion.div
                  key={sku.pitch}
                  className={`specs__sku-card ${sku.highlight ? 'specs__sku-card--highlight' : ''}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                >
                  <div className="specs__sku-head">
                    <span className="specs__sku-tag">{sku.tag}</span>
                    <h4 className="specs__sku-pitch">{sku.pitch}</h4>
                    <p className="specs__sku-code">{sku.code}</p>
                    {sku.virtual && (
                      <p className="specs__sku-virtual">{sku.virtual}</p>
                    )}
                  </div>
                  <div className="specs__sku-specs">
                    {sku.specs.map(([label, value]) => (
                      <div key={label} className="specs__sku-spec">
                        <span className="specs__sku-spec-label">{label}</span>
                        <span className="specs__sku-spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="specs__footnote">
              All specifications per engineering data sheet. MVD / OVD / Retinal distances calculated
              via arc-minute formula (pitch × 3.438). Custom configurations on request —
              contact our Ahmedabad experience center.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
