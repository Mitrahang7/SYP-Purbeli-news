import { Link } from 'react-router-dom';
import { useState } from 'react';
import {Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import '../styles/footer.css';
import confetti from 'canvas-confetti';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await api.post('/newsletter/', { email });
      setEmail('');
      toast.success('Thank you for subscribing.');
      
      // Trigger confetti effect
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.email?.[0] || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo-link">
              <h2 className="footer__logo">
                PRUBELI<span className="footer__logo-accent">NEWS</span>
              </h2>
            </Link>
            <p className="footer__description">
              Prubeli News is the leading digital news portal from Eastern Nepal, providing real-time updates on politics, economy, sports, and culture.
            </p>
            <ul className="footer__social">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Youtube">
                  <Youtube size={18} />
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer__column-title">Categories</h3>
            <ul className="footer__nav-list">
              <li><Link to="/category/Politics">Politics</Link></li>
              <li><Link to="/category/Economy">Economy</Link></li>
              <li><Link to="/category/Sports">Sports</Link></li>
              <li><Link to="/category/Entertainment">Entertainment</Link></li>
              <li><Link to="/category/Technology">Technology</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="footer__column-title">Company</h3>
            <ul className="footer__nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer__column-title">Contact</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <MapPin className="footer__contact-icon" />
                <span>Main Road, Biratnagar-7, Koshi Province, Nepal</span>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <Phone className="footer__contact-icon" />
                <span>+977-21-XXXXXXX</span>
              </li>
              <li className="footer__contact-item footer__contact-item--center">
                <Mail className="footer__contact-icon" />
                <span>info@prubelinews.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter Section */}
        <div style={{ gridColumn: '1 / -1', marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid #374151' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Subscribe to our Newsletter</h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Get the latest news and updates delivered directly to your inbox.</p>
          <form style={{ display: 'flex', gap: '0.75rem', maxWidth: '450px' }} onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: 'white', outline: 'none' }} 
              required
            />
            <button 
              type="submit" 
              disabled={isSubscribing} 
              style={{ background: '#b91c1c', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: isSubscribing ? 'not-allowed' : 'pointer', opacity: isSubscribing ? 0.7 : 1 }}
            >
              {isSubscribing ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Prubeli News Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};