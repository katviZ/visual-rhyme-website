import { useState } from 'react';
import { motion } from 'framer-motion';
import RevealSection from './ui/RevealSection';
import MagneticWrapper from './ui/MagneticWrapper';

// Configure your form submission endpoint here.
// Options:
//   - Formspree:   "https://formspree.io/f/YOUR_FORM_ID"
//   - Web3Forms:   "https://api.web3forms.com/submit" (add access_key to formData)
//   - Custom API:  "https://your-api.com/contact"
// Set to null to use mailto fallback.
const FORM_ENDPOINT = null;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', requirement: '', message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[+\d][\d\s-]{7,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', phone: '', company: '', requirement: '', message: '' });
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else {
      // Mailto fallback when no endpoint is configured
      const subject = encodeURIComponent(`Inquiry from ${formData.name} - ${formData.requirement || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nRequirement: ${formData.requirement}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:Visualrhymepurchase@gmail.com?subject=${subject}&body=${body}`;
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', requirement: '', message: '' });
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <RevealSection className="contact">
      <div id="contact" className="contact__inner">
        <div className="contact__info">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">
            Let's Build Something
            <span className="text-gradient"> Extraordinary</span>
          </h2>
          <p className="contact__description">
            Whether you need a quote, a site survey, or just want to talk displays —
            we're here. Fill out the form and our team will get back within 24 hours.
          </p>

          <div className="contact__details">
            <div className="contact__detail">
              <span className="contact__detail-label">Call Us</span>
              <a href="tel:+919974531845">+91 99745 31845</a>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-label">Alternate</span>
              <a href="tel:+917090588882">+91 70905 88882</a>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-label">Email</span>
              <a href="mailto:Visualrhymepurchase@gmail.com">Visualrhymepurchase@gmail.com</a>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-label">Office</span>
              <address className="contact__detail-address">193, 9th Floor, Silver Radiance 4, off SG Highway, Beside Bhavik Publication, Gota, Ahmedabad - 382481</address>
            </div>
            <div className="contact__detail">
              <span className="contact__detail-label">Registered Address</span>
              <address className="contact__detail-address">002, Mashri Prajavani, Near Palloti Nilaya, Chellikere, Kalyan Nagar, Bangalore - 560043</address>
            </div>
          </div>

          <div className="contact__socials">
            <a href="https://instagram.com/visualrhyme.digital" target="_blank" rel="noopener noreferrer" className="contact__social" aria-label="Follow us on Instagram">Instagram</a>
            <a href="https://linkedin.com/company/visual-rhyme" target="_blank" rel="noopener noreferrer" className="contact__social" aria-label="Connect on LinkedIn">LinkedIn</a>
            <a href="https://youtube.com/@VisualRhyme" target="_blank" rel="noopener noreferrer" className="contact__social" aria-label="Watch on YouTube">YouTube</a>
          </div>
        </div>

        <motion.form
          className="contact__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          noValidate
        >
          {status === 'success' && (
            <motion.div
              className="contact__success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert"
            >
              Thank you! We'll be in touch within 24 hours.
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              className="contact__error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              role="alert"
            >
              Something went wrong. Please try again or call us directly.
            </motion.div>
          )}

          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <span className="contact__field-error" id="name-error">{errors.name}</span>}
            </div>
            <div className="contact__field">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span className="contact__field-error" id="email-error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && <span className="contact__field-error" id="phone-error">{errors.phone}</span>}
            </div>
            <div className="contact__field">
              <label htmlFor="company">Company</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your company" />
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="requirement">What are you looking for?</label>
            <select id="requirement" name="requirement" value={formData.requirement} onChange={handleChange}>
              <option value="">Select a product</option>
              <option value="leynna-sapphire">Leynna Sapphire (MicroLED Premium)</option>
              <option value="leynna-sapphire-tv">Leynna Sapphire TV (108" - 163")</option>
              <option value="leynna-cosmo">Leynna Cosmo (MicroLED Commercial)</option>
              <option value="reyansh-outdoor">Reyansh Outdoor MiniLED (P3/P4/P6)</option>
              <option value="reyansh-indoor">Reyansh Indoor MiniLED (P1.86/P2.5)</option>
              <option value="custom">Custom Solution</option>
            </select>
          </div>

          <div className="contact__field">
            <label htmlFor="message">Tell us about your project</label>
            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Venue size, use case, timeline, budget range..." />
          </div>

          <MagneticWrapper fullWidth>
            <motion.button
              type="submit"
              className="btn btn--primary btn--lg btn--full"
              whileTap={{ scale: 0.98 }}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
              {status !== 'submitting' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              )}
            </motion.button>
          </MagneticWrapper>
        </motion.form>
      </div>
    </RevealSection>
  );
}
