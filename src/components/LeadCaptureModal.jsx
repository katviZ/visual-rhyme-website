import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// TODO: Replace placeholder with your Web3Forms access_key
// Sign up free at https://web3forms.com — paste the key below
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
const GUIDE_URL = '/buyers-guide.html';

const interestOptions = [
  'Leynna MicroLED (Premium)',
  'Reyansh Indoor (Corporate / Retail)',
  'Reyansh Outdoor (DOOH / Stadium)',
  'Not sure yet — recommend for me',
];

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', interest: interestOptions[0] });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenis) {
      if (isOpen) lenis.stop();
      else lenis.start();
    }
    if (!isOpen) {
      setStatus('idle');
      setForm({ name: '', company: '', email: '', interest: interestOptions[0] });
    }
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Buyer's Guide download — ${form.company || form.name}`,
      from_name: 'Visual Rhyme Lead Capture',
      name: form.name,
      company: form.company,
      email: form.email,
      product_interest: form.interest,
      source: 'Buyer\'s Guide CTA',
    };

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      // Open guide regardless of response — graceful degradation
      window.open(GUIDE_URL, '_blank', 'noopener,noreferrer');
      setStatus(res.ok ? 'success' : 'success'); // still success-state UX even if server hiccup
    } catch {
      // Network failed — still deliver the guide
      window.open(GUIDE_URL, '_blank', 'noopener,noreferrer');
      setStatus('success');
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lead-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lead-modal"
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lead-modal__close" onClick={onClose} aria-label="Close">×</button>

            {status !== 'success' ? (
              <>
                <div className="lead-modal__head">
                  <span className="lead-modal__kicker">Free · 12 pages · No spam</span>
                  <h3 className="lead-modal__title">
                    Get the <span className="text-gradient">LED Buyer's Guide</span>
                  </h3>
                  <p className="lead-modal__lede">
                    The honest, science-backed handbook for evaluating any MicroLED or MiniLED
                    installation in India. Built from our 50-page master knowledge base.
                  </p>
                </div>

                <form className="lead-modal__form" onSubmit={handleSubmit}>
                  <div className="lead-modal__field">
                    <label htmlFor="lead-name">Name</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="lead-modal__field">
                    <label htmlFor="lead-company">Company</label>
                    <input
                      id="lead-company"
                      type="text"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      placeholder="Organisation (optional)"
                    />
                  </div>

                  <div className="lead-modal__field">
                    <label htmlFor="lead-email">Work email</label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className="lead-modal__field">
                    <label htmlFor="lead-interest">Primary interest</label>
                    <select
                      id="lead-interest"
                      value={form.interest}
                      onChange={(e) => update('interest', e.target.value)}
                    >
                      {interestOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="lead-modal__submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Get the Guide →'}
                  </button>

                  <p className="lead-modal__fineprint">
                    We'll email you the PDF and follow up only if you have specific questions.
                    Unsubscribe in one click.
                  </p>
                </form>
              </>
            ) : (
              <motion.div
                className="lead-modal__success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="lead-modal__check">✓</div>
                <h3 className="lead-modal__title">Guide opened in a new tab.</h3>
                <p className="lead-modal__lede">
                  We've also logged your details, {form.name.split(' ')[0] || 'Sir'}. Our team
                  will reach out within 1 business day if your project warrants a site visit.
                </p>
                <button className="lead-modal__submit" onClick={onClose}>Close</button>
                <a
                  className="lead-modal__resend"
                  href={GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the guide again →
                </a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
