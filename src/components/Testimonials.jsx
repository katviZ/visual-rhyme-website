import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealSection from './ui/RevealSection';

const testimonials = [
  {
    quote: 'The Leynna Sapphire wall in our boardroom has completely transformed client presentations. The color accuracy and contrast are in a different league — our architects use it for design reviews and the results speak for themselves.',
    name: 'Arjun Mehta',
    role: 'Managing Director, Apex Constructions',
  },
  {
    quote: 'We evaluated five LED vendors before choosing Visual Rhyme for our stadium project. The Reyansh Outdoor P4X delivered exceptional daylight visibility at 8,000+ nits, and their installation team had everything calibrated within 48 hours.',
    name: 'Priya Sharma',
    role: 'Head of Operations, Gujarat Sports Authority',
  },
  {
    quote: 'What sold us was the after-sales commitment. Two years in, our Reyansh Indoor displays still look factory-fresh. The cloud CMS makes content updates effortless across all twelve of our retail locations.',
    name: 'Vikram Patel',
    role: 'VP Marketing, Luxora Retail Group',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [paused, advance]);

  return (
    <RevealSection className="testimonials">
      <div className="testimonials__inner">
        <span className="section-label">What Clients Say</span>
        <h2 className="section-title">
          Trusted by
          <span className="text-gradient"> Industry Leaders</span>
        </h2>

        <div
          className="testimonials__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-label="Client testimonials"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="testimonials__card"
              initial={{ opacity: 0, x: 50, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 5 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonials__quote-mark" aria-hidden="true">"</div>
              <blockquote className="testimonials__quote">{testimonials[active].quote}</blockquote>
              <div className="testimonials__author">
                <strong>{testimonials[active].name}</strong>
                <span>{testimonials[active].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonials__dots" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((t, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === active ? 'testimonials__dot--active' : ''}`}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial from ${t.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
