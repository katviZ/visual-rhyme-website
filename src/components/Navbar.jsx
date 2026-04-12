import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LogoIcon from './ui/LogoIcon';
import MagneticWrapper from './ui/MagneticWrapper';

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Applications', href: '#applications' },
  { label: 'Technology', href: '#technology' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onOpenQuote }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo" aria-label="Visual Rhyme - Home">
          <LogoIcon size={32} color="#A855F7" />
          <span className="logo-text">Visual<span className="logo-accent">Rhyme</span></span>
        </a>

        <div
          className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}
          role="menubar"
        >
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="navbar__link"
              role="menuitem"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
          <MagneticWrapper>
            <button className="btn btn--primary btn--nav" onClick={() => { setMenuOpen(false); onOpenQuote(); }}>
              Pixel Quote Pro
            </button>
          </MagneticWrapper>
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
        >
          <span /><span /><span />
        </button>
      </div>
    </motion.nav>
  );
}
