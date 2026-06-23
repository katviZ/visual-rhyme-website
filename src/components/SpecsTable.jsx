import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const families = [
  {
    id: 'leynna-sapphire-tv',
    label: 'Leynna Sapphire TV',
    blurb: 'Furniture-grade MicroLED televisions on Sapphire substrate · 108" to 163" · 281 trillion colors · 1,000,000:1 dynamic contrast · HDR10/HLG · wall-mount or floor-stand. Mesmerizing visuals for luxury residential, private cinemas, premium lounges, executive suites.',
    shared: [
      ['Pixel Type',     'TrueHue MicroLED · Sapphire substrate'],
      ['Pixel Engine',   'Sapphire Pixel Engine'],
      ['Surface',        'Graviton Black · IP65 front'],
      ['Color Depth',    '48-bit · 65,536 grayscale levels'],
      ['Color',          '281 Trillion · ≥95% DCI-P3 · ≥90% Rec2020'],
      ['Contrast',       '≤20,000:1 static · ≤1,000,000:1 dynamic'],
      ['HDR',            'HDR10 / HLG'],
      ['Calibration',    '≥98% brightness/color uniformity · 16-bit · D65'],
      ['Audio / OS',     '2 × 30 W stereo · Android or Android/Windows dual-boot'],
      ['Warranty',       '3 yr std · Up to 5 yr · 5% spares · 7 yr support'],
    ],
    skus: [
      { pitch: '108"',  code: 'LS1KTV108',  tag: 'Compact Cinema',        specs: [['Resolution','1920 × 1080 (FHD)'],['Screen','2400 × 1350 mm'],['Frame','2422 × 1481 mm'],['Weight','155 / 195 kg (wall / stand)'],['Peak Brightness','≥1,200 nits'],['Sustained','≤800 nits'],['Refresh Rate','≤3,840 Hz'],['Frame Rate','≤120 Hz'],['Optimal Viewing','0.93 m'],['Viewing Angle','175° / 175°'],['Power','≤1,700 W'],['Heat','≤4,352 BTU/hr']] },
      { pitch: '136"',  code: 'LS1KTV136',  tag: 'Cinema Hall · FHD',     specs: [['Resolution','1920 × 1080 (FHD)'],['Screen','3000 × 1687.5 mm'],['Frame','3022 × 1818.5 mm'],['Weight','210 / 250 kg (wall / stand)'],['Peak Brightness','≥1,200 nits'],['Sustained','≤800 nits'],['Refresh Rate','≤3,840 Hz'],['Frame Rate','≤120 Hz'],['Optimal Viewing','1.17 m'],['Viewing Angle','175° / 175°'],['Power','≤2,300 W'],['Heat','≤5,891 BTU/hr']] },
      { pitch: '136"',  code: 'LS4KTV136',  tag: 'Cinema Hall · 4K',      highlight: true, specs: [['Resolution','3840 × 2160 (4K UHD)'],['Screen','3000 × 1687.5 mm'],['Frame','3022 × 1818.5 mm'],['Weight','210 / 250 kg (wall / stand)'],['Peak Brightness','≥1,200 nits'],['Sustained','≤800 nits'],['Refresh Rate','≤3,840 Hz'],['Frame Rate','≤120 Hz'],['Optimal Viewing','0.60 m'],['Viewing Angle','175° / 175°'],['Power','≤2,300 W'],['Heat','≤5,891 BTU/hr']] },
      { pitch: '163"',  code: 'LS4KTV163',  tag: 'Flagship · 4K',         highlight: true, specs: [['Resolution','3840 × 2160 (4K UHD)'],['Screen','3600 × 2025 mm'],['Frame','3622 × 2156 mm'],['Weight','300 / 370 kg (wall / stand)'],['Peak Brightness','≥1,200 nits'],['Sustained','≤800 nits'],['Refresh Rate','≤3,840 Hz'],['Frame Rate','≤120 Hz'],['Optimal Viewing','0.70 m'],['Viewing Angle','175° / 175°'],['Power','≤3,200 W'],['Heat','≤8,189 BTU/hr']] },
    ],
  },
  {
    id: 'leynna-cosmo',
    label: 'Leynna Cosmo',
    blurb: 'MicroLED panels on Sapphire substrate · four pitches × two engine tiers. ECO uses our Dynamic Pixel Engine (300,000:1 dynamic contrast, ≥90% DCI-P3). ULTRA upgrades to the Sapphire Pixel Engine (1,000,000:1 dynamic contrast, ≥95% DCI-P3, ≥97% uniformity). Mesmerizing visuals for every setting.',
    shared: [
      ['Technology',     'Flip Chip On Board · TrueHue MicroLED'],
      ['Substrate',      'Sapphire · Graviton Black'],
      ['Cabinet',        '600 × 337.5 × 44.5 mm · Aluminium Die Cast · 4.8 kg'],
      ['Service',        'Front · Wire-Free'],
      ['Color',          '281 Trillion (16-bit) · 65,536 grayscale'],
      ['Brightness',     'Sustained ~800 nits · Peak ~1,200 nits'],
      ['Refresh / Life', '3,840 Hz · ~100,000 hr lifespan'],
      ['Redundancy',     'Optional: Data / Power / Both'],
      ['IP / Calib.',    'IP65 front · 16-bit calibration · D65'],
      ['Warranty',       '3 yr std · Up to 5 yr · 5% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P0.93 ECO',   code: 'Dynamic Pixel Engine',  tag: 'Premium · Eco',     specs: [['Pixel Engine','Dynamic'],['Cabinet Resolution','640 × 360'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥300,000:1'],['Color Gamut','≥90% DCI-P3 · ≥85% Rec2020'],['Uniformity','≥97% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/40'],['Optimal Viewing','1.02 m'],['Power','≤350 W/sqm avg ≤115 W/sqm']] },
      { pitch: 'P0.93 ULTRA', code: 'Sapphire Pixel Engine', tag: 'Reference',         highlight: true, specs: [['Pixel Engine','Sapphire'],['Cabinet Resolution','640 × 360'],['Static Contrast','≥20,000:1'],['Dynamic Contrast','≥1,000,000:1'],['Color Gamut','≥95% DCI-P3 · ≥90% Rec2020'],['Uniformity','≥98% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/40'],['Optimal Viewing','1.02 m'],['Power','≤350 W/sqm avg ≤115 W/sqm']] },
      { pitch: 'P1.17 ECO',   code: 'Dynamic Pixel Engine',  tag: 'Boardroom · Eco',   specs: [['Pixel Engine','Dynamic'],['Cabinet Resolution','512 × 288'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥300,000:1'],['Color Gamut','≥90% DCI-P3 · ≥85% Rec2020'],['Uniformity','≥97% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/64'],['Optimal Viewing','1.29 m'],['Power','≤300 W/sqm avg ≤100 W/sqm']] },
      { pitch: 'P1.17 ULTRA', code: 'Sapphire Pixel Engine', tag: 'Boardroom · Ultra', specs: [['Pixel Engine','Sapphire'],['Cabinet Resolution','512 × 288'],['Static Contrast','≥20,000:1'],['Dynamic Contrast','≥1,000,000:1'],['Color Gamut','≥95% DCI-P3 · ≥90% Rec2020'],['Uniformity','≥98% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/64'],['Optimal Viewing','1.29 m'],['Power','≤300 W/sqm avg ≤100 W/sqm']] },
      { pitch: 'P1.25 ECO',   code: 'Dynamic Pixel Engine',  tag: 'Lobby · Eco',       specs: [['Pixel Engine','Dynamic'],['Cabinet Resolution','480 × 270'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥300,000:1'],['Color Gamut','≥90% DCI-P3 · ≥85% Rec2020'],['Uniformity','≥97% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/60'],['Optimal Viewing','1.38 m'],['Power','≤300 W/sqm avg ≤100 W/sqm']] },
      { pitch: 'P1.25 ULTRA', code: 'Sapphire Pixel Engine', tag: 'Lobby · Ultra',     specs: [['Pixel Engine','Sapphire'],['Cabinet Resolution','480 × 270'],['Static Contrast','≥20,000:1'],['Dynamic Contrast','≥1,000,000:1'],['Color Gamut','≥95% DCI-P3 · ≥90% Rec2020'],['Uniformity','≥98% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/60'],['Optimal Viewing','1.38 m'],['Power','≤300 W/sqm avg ≤100 W/sqm']] },
      { pitch: 'P1.56 ECO',   code: 'Dynamic Pixel Engine',  tag: 'Volume · Eco',      specs: [['Pixel Engine','Dynamic'],['Cabinet Resolution','384 × 216'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥300,000:1'],['Color Gamut','≥90% DCI-P3 · ≥85% Rec2020'],['Uniformity','≥97% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/54'],['Optimal Viewing','1.72 m'],['Power','≤280 W/sqm avg ≤90 W/sqm']] },
      { pitch: 'P1.56 ULTRA', code: 'Sapphire Pixel Engine', tag: 'Volume · Ultra',    specs: [['Pixel Engine','Sapphire'],['Cabinet Resolution','384 × 216'],['Static Contrast','≥20,000:1'],['Dynamic Contrast','≥1,000,000:1'],['Color Gamut','≥95% DCI-P3 · ≥90% Rec2020'],['Uniformity','≥98% brightness / chroma'],['Viewing Angle','≤175° / 175°'],['Scan Rate','1/54'],['Optimal Viewing','1.72 m'],['Power','≤280 W/sqm avg ≤90 W/sqm']] },
    ],
  },
  {
    id: 'leynna-virtual',
    label: 'Leynna Virtual Pixel',
    blurb: 'RCBP subpixel-sharing architecture · 40% lower cost than equivalent real-pixel pitch · ideal for close-view creative content where apparent resolution matters more than 1:1 fidelity.',
    shared: [
      ['Technology',     'Flip Chip COB · Virtual Pixel (RCBP)'],
      ['Architecture',   'Common Cathode (std) · Common Anode (opt)'],
      ['Substrate',      'Sapphire · Graviton Black'],
      ['Cabinet',        '600 × 337.5 × 44.5 mm · 4.8 kg'],
      ['Service',        'Front · Wire-Free'],
      ['IP / Calib.',    'IP65 Front · 5-Layer · D65'],
      ['HDR / Life',     'HDR10 / HLG · 100,000 hrs'],
      ['Warranty',       '3 yr std · Up to 5 yr · 5% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P0.78 V', code: 'RCBP008', tag: 'Virtual Reference', virtual: '~0.39 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','2.68 m'],['Virtual MVD','1.34 m'],['Retinal Distance','5.36 m']] },
      { pitch: 'P0.93 V', code: 'RCBP009', tag: 'Virtual Premium',   virtual: '~0.47 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','3.20 m'],['Virtual MVD','1.62 m'],['Retinal Distance','6.39 m']] },
      { pitch: 'P1.17 V', code: 'RCBP012', tag: 'Virtual Corporate', virtual: '~0.59 mm effective', specs: [['Bit Depth','14 / 16-bit'],['Peak Brightness','800 nits'],['Static Contrast','≥10,000:1'],['Dynamic Contrast','≥350,000:1'],['Refresh Rate','3,840 Hz'],['Driver IC','Chipone ICND1065S / 2270'],['Color Gamut','≥95% DCI-P3'],['Delta E (ΔE)','<3 avg (Commercial)'],['Viewing Angle','170° / 170°'],['Physical MVD','4.02 m'],['Virtual MVD','2.01 m'],['Retinal Distance','8.04 m']] },
    ],
  },
  {
    id: 'reyansh-indoor',
    label: 'Reyansh Indoor',
    blurb: 'TrueHue MiniLED · SMD and GOB packaging · 640 × 480 mm cabinet · front-serviceable · passively cooled · the Indian corporate / retail / event workhorse from P1.56 to P2.5.',
    shared: [
      ['LED Type',       'TrueHue MiniLED'],
      ['Technology',     'SMD (std) · GOB (G/GS premium)'],
      ['Architecture',   'Common Anode (std) · Common Cathode (opt)'],
      ['Cabinet',        '640 × 480 × 75 mm · Mild Steel / Aluminium Die Cast'],
      ['Service',        'Front'],
      ['Cooling',        'Passive (fanless)'],
      ['Color',          '4.4 Trillion · 14-bit · 16,384 grayscale'],
      ['Refresh / Frame','Up to 7,680 Hz · Up to 120 Hz'],
      ['Calibration',    '14-bit · D65 · ≥93% uniformity (X-tier)'],
      ['Warranty',       '2 yr std · Up to 5 yr · 3% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P1.56',  code: 'SMD · 344×258 cabinet',     tag: 'Fine Pitch',          specs: [['Pixel Density','410,000 dots/sqm'],['Peak Brightness','≤800 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥200,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥1.5 m'],['IP Rating','IP54 (G/GS)'],['Power','≤400 W/sqm']] },
      { pitch: 'P1.86',  code: 'SMD · GOB (G/GS)',          tag: 'Mid-Range',           specs: [['Pixel Density','288,906 dots/sqm'],['Peak Brightness','≤700 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥200,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥1.86 m'],['IP Rating','IP30 / IP54 (G/GS)'],['Power','≤400 W/sqm']] },
      { pitch: 'P2',     code: 'SMD · GOB',                 tag: 'Corporate Standard',  specs: [['Pixel Density','250,000 dots/sqm'],['Peak Brightness','≤800 nits'],['Static Contrast','≥6,000:1'],['Dynamic Contrast','≥250,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥2.0 m'],['IP Rating','IP30 / IP54 (G/GS)'],['Power','≤400 W/sqm']] },
      { pitch: 'P2.5',   code: 'SMD · GOB · GX (Mg-alloy)', tag: 'Workhorse',           highlight: true, specs: [['Pixel Density','160,000 dots/sqm'],['Peak Brightness','≤1,000 nits (X)'],['Static Contrast','≥8,000:1 (X)'],['Dynamic Contrast','≥250,000:1 (X)'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥2.5 m'],['IP Rating','IP30 / IP65 (GX)'],['Power','≤400 W/sqm']] },
    ],
  },
  {
    id: 'reyansh-outdoor',
    label: 'Reyansh Outdoor',
    blurb: 'TrueHue MiniLED · IP65 · up to 11,000 nits peak on X-variant · 960×960 or 640×640 cabinet · X-series adds Nationstar LEDs, gold contacts, naked-eye 3D readiness.',
    shared: [
      ['LED Type',       'TrueHue MiniLED (SMD3535 / SMD1921 / SMD1415)'],
      ['Architecture',   'Common Anode (std) · Common Cathode (opt)'],
      ['Cabinet',        '960×960 or 640×640 · 75 mm · Mild Steel / Aluminium Die Cast'],
      ['Service',        'Rear (std) · Front (opt)'],
      ['IP / Cooling',   'IP65 front · IP54 rear · 1-2 fan active'],
      ['Color',          '4.4 Trillion · 14-bit · 16,384 grayscale'],
      ['Refresh / Frame','Up to 7,680 Hz · Up to 120 Hz · Naked-eye 3D (X)'],
      ['Calibration',    '14-bit · D65 · ≥93% uniformity (X-tier)'],
      ['Warranty',       '2 yr std · Up to 5 yr on X-variant · 3% spares · 7 yr support'],
    ],
    skus: [
      { pitch: 'P2.5',   code: 'SMD1415 · GKGD / Nationstar (X)', tag: 'Fine Outdoor',        specs: [['Pixel Density','160,000 dots/sqm'],['Peak Brightness','≤5,000 nits (std) · ≤6,000 (X)'],['Static Contrast','≥6,000:1 std · ≥8,000:1 X'],['Dynamic Contrast','≥200,000:1 / ≥250,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB · ≤85% Rec2020'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥3 m'],['Naked-eye 3D','X only'],['Power','≤800 W/sqm']] },
      { pitch: 'P3.076', code: 'SMD1415 · GKGD / Nationstar (X)', tag: 'Premium DOOH',        specs: [['Pixel Density','105,625 dots/sqm'],['Peak Brightness','≤5,000 nits (std) · ≤6,000 (X)'],['Static Contrast','≥6,000:1 std · ≥8,000:1 X'],['Dynamic Contrast','≥200,000:1 / ≥250,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB · ≤85% Rec2020'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥3 m'],['Naked-eye 3D','X only'],['Power','≤800 W/sqm']] },
      { pitch: 'P4.0',   code: 'SMD1921 · GKGD / Nationstar (X)', tag: 'DOOH Standard',       specs: [['Pixel Density','62,500 dots/sqm'],['Peak Brightness','≤5,500 nits (std) · ≤6,500 (X)'],['Static Contrast','≥6,000:1 std · ≥8,000:1 X'],['Dynamic Contrast','≥200,000:1 / ≥250,000:1'],['Driver IC','ICN2153 / TBS5266A'],['Color Gamut','≥110% sRGB · ≤85% Rec2020'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥4 m'],['Naked-eye 3D','X only'],['Power','≤800 W/sqm']] },
      { pitch: 'P6.67 X',code: 'SMD3535 · Nationstar · Hybrid PWM+PAM', tag: '11K nits · Billboard', highlight: true, specs: [['Pixel Density','22,500 dots/sqm'],['Peak Brightness','≤6,000 nits std · ≤11,000 (X)'],['Static Contrast','≥6,000:1 std · ≥8,000:1 X'],['Dynamic Contrast','≥200,000:1 / ≥250,000:1'],['Driver IC','TBS5266A (Hybrid PWM+PAM)'],['Color Gamut','≥110% sRGB · ≤85% Rec2020'],['Viewing Angle','155° / 155°'],['Optimal Viewing','≥3 m'],['Naked-eye 3D','X only'],['Power','≤800 W/sqm']] },
    ],
  },
];

const totalSkus = families.reduce((sum, f) => sum + f.skus.length, 0);

export default function SpecsTable() {
  const [active, setActive] = useState(0);
  const family = families[active];

  return (
    <div className="specs specs--inline">
      <div className="specs__inner">
        <div className="specs__header">
          <span className="specs__kicker">Technical Specifications</span>
          <h3 className="specs__title">
            {totalSkus} configurations. <span className="text-gradient">Five product families.</span>
          </h3>
          <p className="specs__lede">
            Every SKU below carries the full engineering specification —
            pixel engine, architecture, contrast, gamut, calibration, and viewing geometry.
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
                  key={`${sku.pitch}-${sku.code}`}
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
              All specifications per engineering data sheet. Custom sizes, pitches, and cabinet
              materials available on request — contact our Ahmedabad experience center.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
