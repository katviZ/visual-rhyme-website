import LogoIcon from './ui/LogoIcon';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="navbar__logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoIcon size={28} color="#A855F7" />
            <span className="logo-text">Visual<span className="logo-accent">Rhyme</span></span>
          </div>
          <p className="footer__tagline">Mesmerizing Digital Experiences</p>
          <p className="footer__company-info">Visual Rhyme Pvt. Ltd.</p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4>MicroLED</h4>
            <a href="#products">Leynna Sapphire</a>
            <a href="#products">Leynna Sapphire TV</a>
            <a href="#products">Leynna Cosmo</a>
          </div>
          <div className="footer__col">
            <h4>MiniLED</h4>
            <a href="#products">Reyansh Outdoor</a>
            <a href="#products">Reyansh Indoor</a>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#technology">Technology</a>
            <a href="#applications">Applications</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer__col">
            <h4>Connect</h4>
            <a href="https://instagram.com/visualrhyme.digital" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com/company/visual-rhyme" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://youtube.com/@VisualRhyme" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="mailto:Visualrhymepurchase@gmail.com">Email Us</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Visual Rhyme Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
