import LogoIcon from './ui/LogoIcon';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const productLinks = [
  { label: 'Leynna Sapphire', href: '#products' },
  { label: 'Leynna Sapphire TV', href: '#products' },
  { label: 'Leynna Cosmo', href: '#products' },
  { label: 'Reyansh Outdoor', href: '#products' },
  { label: 'Reyansh Indoor', href: '#products' },
];
const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Technology', href: '#technology' },
  { label: 'Applications', href: '#applications' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];
const supportLinks = [
  { label: 'Pixel Quote Pro', href: '#hero' },
  { label: 'Warranty', href: '#technology' },
  { label: 'Pan-India Install', href: '#process' },
  { label: 'Spare Modules', href: '#technology' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-v2" role="contentinfo">
      <div className="footer-v2__top" aria-hidden="true">
        <span className="footer-v2__wordmark">VisualRhyme</span>
      </div>

      <div className="footer-v2__inner">
        <div className="footer-v2__brand">
          <a href="#hero" className="footer-v2__logo">
            <LogoIcon size={32} color="#A855F7" />
            <span className="logo-text">Visual<span className="logo-accent">Rhyme</span></span>
          </a>
          <p className="footer-v2__tagline">
            India's pioneering MicroLED &amp; MiniLED display brand. We don't build screens —
            we engineer emotions.
          </p>
          <div className="footer-v2__contact">
            <a href="tel:+919974531845" className="footer-v2__contact-item">
              <span className="footer-v2__contact-label">CALL</span>
              <span className="footer-v2__contact-value">+91 99745 31845</span>
            </a>
            <a href="mailto:Visualrhymepurchase@gmail.com" className="footer-v2__contact-item">
              <span className="footer-v2__contact-label">EMAIL</span>
              <span className="footer-v2__contact-value">Visualrhymepurchase@gmail.com</span>
            </a>
            <div className="footer-v2__contact-item">
              <span className="footer-v2__contact-label">BASED IN</span>
              <span className="footer-v2__contact-value">Ahmedabad, India</span>
            </div>
          </div>
        </div>

        <div className="footer-v2__cols">
          <div className="footer-v2__col">
            <h4>Products</h4>
            <ul>
              {productLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-v2__col">
            <h4>Company</h4>
            <ul>
              {companyLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-v2__col">
            <h4>Support</h4>
            <ul>
              {supportLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-v2__bottom">
        <p>&copy; {year} Visual Rhyme Pvt. Ltd. All rights reserved.</p>
        <div className="footer-v2__socials" aria-label="Social media">
          <a href="https://instagram.com/visualrhyme.digital" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
          <a href="https://linkedin.com/company/visual-rhyme" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          <a href="https://youtube.com/@VisualRhyme" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YouTubeIcon /></a>
          <a href="mailto:Visualrhymepurchase@gmail.com" aria-label="Email"><MailIcon /></a>
        </div>
      </div>
    </footer>
  );
}
