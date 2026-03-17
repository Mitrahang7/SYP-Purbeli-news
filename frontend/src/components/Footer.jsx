import {Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <h2 className="footer__logo">
              PRUBELI<span className="footer__logo-accent">NEWS</span>
            </h2>
            <p className="footer__description">
              Prubeli News is the leading digital news portal from Eastern Nepal, providing real-time updates on politics, economy, sports, and culture.
            </p>
            <ul className="footer__social">
              <li>
                <a href="#" className="footer__social-link" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </li>
              <li>
                <a href="#" className="footer__social-link" aria-label="Youtube">
                  <Youtube size={18} />
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="footer__column-title">Categories</h3>
            <ul className="footer__nav-list">
              <li><a href="#">Politics</a></li>
              <li><a href="#">Economy</a></li>
              <li><a href="#">Sports</a></li>
              <li><a href="#">Prubeli Special</a></li>
              <li><a href="#">Technology</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="footer__column-title">Company</h3>
            <ul className="footer__nav-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Team</a></li>
              <li><a href="#">Advertise</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
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

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Prubeli News Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};