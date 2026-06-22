import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pitchOptions = [
  { pitch: 0.78,  product: 'Leynna Real Pixel P0.78',  family: 'MicroLED · MCBP Pro S',       tag: 'Reference' },
  { pitch: 0.93,  product: 'Leynna Real Pixel P0.93',  family: 'MicroLED · MCBP Pro S',       tag: 'Broadcast' },
  { pitch: 1.17,  product: 'Leynna Real Pixel P1.17',  family: 'MicroLED · Custom COB',       tag: 'Premium' },
  { pitch: 1.25,  product: 'Leynna Real Pixel P1.25',  family: 'MicroLED · MCBP Pro S',       tag: 'Entry Premium' },
  { pitch: 1.56,  product: 'Leynna Real Pixel P1.56',  family: 'MicroLED · MCBP Pro S',       tag: 'Premium' },
  { pitch: 1.86,  product: 'Leynna Real Pixel P1.86',  family: 'MicroLED · MCUP Pro S · 22-bit', tag: 'Flagship' },
  { pitch: 2.5,   product: 'Reyansh Indoor P2.5',      family: 'MiniLED · SMD/GOB',           tag: 'Volume' },
  { pitch: 3.076, product: 'Reyansh Outdoor P3',       family: 'Outdoor · SMD IP65',          tag: 'Premium DOOH' },
  { pitch: 4,     product: 'Reyansh Outdoor P4',       family: 'Outdoor · SMD IP65',          tag: 'DOOH' },
  { pitch: 6.67,  product: 'Reyansh Outdoor P6.67',    family: 'Outdoor · SMD IP65',          tag: 'Billboard' },
];

function recommend(distanceM) {
  const requiredPitch = distanceM / 3.438;
  const sortedDesc = [...pitchOptions].sort((a, b) => b.pitch - a.pitch);
  const bestFit = sortedDesc.find((o) => o.pitch <= requiredPitch) || pitchOptions[0];
  const idx = pitchOptions.findIndex((o) => o.pitch === bestFit.pitch);
  const premium = idx > 0 ? pitchOptions[idx - 1] : null;
  return { requiredPitch, bestFit, premium };
}

export default function PitchCalculator() {
  const [distance, setDistance] = useState(5);
  const { requiredPitch, bestFit, premium } = useMemo(() => recommend(distance), [distance]);

  return (
    <motion.div
      className="pitch-calc"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pitch-calc__header">
        <span className="pitch-calc__kicker">Find Your Pitch</span>
        <h3 className="pitch-calc__title">
          The <span className="text-gradient">1 arc minute</span> rule — decoded
        </h3>
        <p className="pitch-calc__lede">
          Your eye resolves 1/60th of a degree. Tell us the viewing distance —
          the math tells us which panel is correct for your room.
        </p>
      </div>

      <div className="pitch-calc__body">
        <div className="pitch-calc__input">
          <div className="pitch-calc__distance-label">
            <span className="pitch-calc__distance-caption">Typical viewing distance</span>
            <motion.span
              key={distance}
              className="pitch-calc__distance-value"
              initial={{ scale: 1.15, color: '#c084fc' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.35 }}
            >
              {distance.toFixed(1)} m
            </motion.span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="pitch-calc__slider"
            aria-label="Viewing distance in meters"
          />
          <div className="pitch-calc__scale">
            <span>1 m</span>
            <span>Close viewing · Boardrooms</span>
            <span>30 m</span>
          </div>

          <div className="pitch-calc__formula">
            <span className="pitch-calc__formula-eq">
              {distance.toFixed(1)} ÷ 3.438 = <strong>{requiredPitch.toFixed(2)} mm</strong>
            </span>
            <span className="pitch-calc__formula-caption">minimum required pitch</span>
          </div>
        </div>

        <div className="pitch-calc__output">
          <AnimatePresence mode="wait">
            <motion.div
              key={bestFit.product}
              className="pitch-calc__rec"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pitch-calc__rec-tag">{bestFit.tag}</span>
              <h4 className="pitch-calc__rec-name">{bestFit.product}</h4>
              <p className="pitch-calc__rec-family">{bestFit.family}</p>
              <div className="pitch-calc__rec-pitch">
                <span className="pitch-calc__rec-pitch-value">P{bestFit.pitch}</span>
                <span className="pitch-calc__rec-pitch-label">pixel pitch</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {premium && premium.pitch !== bestFit.pitch && (
            <div className="pitch-calc__premium">
              <span className="pitch-calc__premium-label">Want finer detail?</span>
              <strong>{premium.product}</strong>
              <span className="pitch-calc__premium-pitch">P{premium.pitch}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
