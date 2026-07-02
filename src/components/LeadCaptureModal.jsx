import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead, isConfigured } from '../lib/leadCapture';

const GUIDE_URL = '/buyers-guide.html';

const interestOptions = [
  'Leynna MicroLED (Premium)',
  'Reyansh Indoor (Corporate / Retail)',
  'Reyansh Outdoor (DOOH / Stadium)',
  'Not sure yet — recommend for me',
];

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    interest: interestOptions[0],
    _honey: '', // bot honeypot — humans never fill this
  });
  // idle | submitting | success | queued | error
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenis) {
      if (isOpen) lenis.stop();
      else lenis.start();
    }
    if (!isOpen) {
      setStatus('idle');
      setErrorMsg('');
      setForm({ name: '', company: '', email: '', interest: interestOptions[0], _honey: '' });
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
    setErrorMsg('');

    const result = await submitLead({
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      product_interest: form.interest,
      source: "Buyer's Guide CTA",
      _honey: form._honey,
    });

    // Always open the guide — the value promise is met regardless of
    // whether our backend captured the lead. Their copy is safe with us.
    window.open(GUIDE_URL, '_blank', 'noopener,noreferrer');

    if (result.ok) {
      setStatus('success');
    } else if (result.queued) {
      // Saved to localStorage — will auto-retry on next visit.
      setStatus('queued');
      setErrorMsg(result.error || '');
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'unknown-error');
    }
  }

  const submitDisabled = status === 'submitting';
  const firstName = form.name.trim().split(' ')[0] || 'Sir';

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

            {status !== 'success' && status !== 'queued' ? (
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
                  {/* Honeypot — visually hidden but visible to bots */}
                  <div
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
                  >
                    <label htmlFor="lead-website">Website</label>
                    <input
                      id="lead-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form._honey}
                      onChange={(e) => update('_honey', e.target.value)}
                    />
                  </div>

                  <div className="lead-modal__field">
                    <label htmlFor="lead-name">Name</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
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
                      autoComplete="organization"
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
                      autoComplete="email"
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
                    disabled={submitDisabled}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Get the Guide →'}
                  </button>

                  {status === 'error' && (
                    <p className="lead-modal__error" role="alert">
                      We couldn't reach our servers. Your guide opened in a new tab —
                      please email us at{' '}
                      <a href="mailto:katvisualrhyme@gmail.com">katvisualrhyme@gmail.com</a>{' '}
                      if you'd like to hear back.
                    </p>
                  )}

                  <p className="lead-modal__fineprint">
                    We'll email you the PDF and follow up only if you have specific questions.
                    Unsubscribe in one click.
                    {!isConfigured() && (
                      <>
                        <br />
                        <em style={{ opacity: 0.55 }}>(Dev note: lead endpoint not yet
                        configured — submissions cache locally and retry once
                        Apps Script URL is wired.)</em>
                      </>
                    )}
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
                <h3 className="lead-modal__title">
                  {status === 'success'
                    ? 'Guide opened in a new tab.'
                    : 'Your guide is open — we saved your details locally.'}
                </h3>
                <p className="lead-modal__lede">
                  {status === 'success' ? (
                    <>
                      We've logged your details, {firstName}. Our team will reach out within
                      one business day if your project warrants a site visit.
                    </>
                  ) : (
                    <>
                      Your submission will retry automatically. If you'd like a faster response,
                      email us directly at{' '}
                      <a href="mailto:katvisualrhyme@gmail.com">katvisualrhyme@gmail.com</a>.
                    </>
                  )}
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
