import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldAlert } from 'lucide-react';
import '../styles/AdModal.css';

const AdModal = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal-container">
        <div className="ad-modal-content">
          <div className="ad-modal-badge">ADVERTISEMENT</div>
          <h2 className="ad-modal-title">Elevate Your Business with Purbeli News</h2>
          <p className="ad-modal-description">
            Reach thousands of daily readers in Eastern Nepal. Our premium ad slots give your brand the visibility it deserves.
          </p>
          
          <div className="ad-modal-promo">
            <div className="promo-icon">
              <ShieldAlert size={32} color="#ef4444" />
            </div>
            <div className="promo-text">
              <h4>Remove Ads with a Free Account</h4>
              <p>Sign up or Login to enjoy an ad-free reading experience on Prubeli News.</p>
            </div>
          </div>

          <div className="ad-modal-actions">
            <button className="ad-modal-btn ad-modal-btn--primary" onClick={() => window.open('mailto:ads@purbelinews.com')}>
              <ExternalLink size={18} />
              Advertise with Us
            </button>
            <button className="ad-modal-btn ad-modal-btn--secondary" onClick={onLoginClick}>
              Login to Hide Ads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
