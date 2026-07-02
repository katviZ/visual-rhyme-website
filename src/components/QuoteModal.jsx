import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteModal({ isOpen, onClose }) {
  const historyPushedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenis) {
      if (isOpen) lenis.stop();
      else lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  // Browser back-button handling: push a history state when modal opens so
  // pressing "back" closes the modal instead of navigating off the site.
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: 'pqm' }, '');
      historyPushedRef.current = true;
      const onPop = () => {
        historyPushedRef.current = false;
        onClose();
      };
      window.addEventListener('popstate', onPop);
      return () => window.removeEventListener('popstate', onPop);
    }
  }, [isOpen, onClose]);

  // If user closes via X / Esc / overlay click, consume our pushed history entry
  // so the URL doesn't keep a stale modal state.
  const handleClose = () => {
    if (historyPushedRef.current && window.history.state && window.history.state.modal === 'pqm') {
      historyPushedRef.current = false;
      window.history.back();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="quote-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Quote Studio — Pixel Quote Max"
        >
          <motion.div
            className="quote-modal-content quote-modal-content--max"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button
              className="quote-modal-close"
              onClick={handleClose}
              aria-label="Close quote tool"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src="/pqm/index.html"
              title="Quote Studio — Pixel Quote Max"
              className="quote-modal-iframe"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
