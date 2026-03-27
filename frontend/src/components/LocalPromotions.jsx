import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';
import '../styles/LocalPromotions.css';

export const LocalPromotions = () => {
  const [index, setIndex] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await api.get('/promotions/');
        setPromotions(res.data.results || res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (selectedPromo || promotions.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [selectedPromo, promotions]);

  if (loading || promotions.length === 0) return null;

  const current = promotions[index];

  return (
    <div className="local-promotions-premium">
      <div className="local-promotions__header-tag">
        <span>SPONSORED</span>
      </div>

      <div className="local-promotions__premium-screen" onClick={() => setSelectedPromo(current)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="local-promotions__premium-banner"
          >
            <img src={current.image} alt={current.title} className="local-promotions__premium-bg" />
            <div className="local-promotions__premium-overlay"></div>
            
            <div className="local-promotions__premium-content">
              <div className="local-promotions__premium-badge" style={{ background: current.color || '#b91c1c' }}>
                {current.type}
              </div>
              <div className="local-promotions__premium-text-area">
                <h3 className="local-promotions__premium-title">{current.title}</h3>
                <p className="local-promotions__premium-subtitle">{current.subtitle}</p>
                <div className="local-promotions__premium-action">
                   <span>Learn More</span> <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="local-promotions__premium-dots">
          {promotions.map((_, i) => (
            <div 
              key={i} 
              className={`local-promotions__premium-dot ${i === index ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            />
          ))}
        </div>
      </div>

      {/* Promotion Detail Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <div className="promo-modal-overlay" onClick={() => setSelectedPromo(null)}>
            <motion.div 
              className="promo-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="promo-modal__header" style={{ background: selectedPromo.color }}>
                <img src={selectedPromo.image} alt={selectedPromo.title} className="promo-modal__image" />
                <div className="promo-modal__overlay-gradient" style={{ background: `linear-gradient(to bottom, transparent, ${selectedPromo.color || '#000'})` }} />
                <div className="promo-modal__header-content">
                  <div className="promo-modal__type">{selectedPromo.type}</div>
                  <h2 className="promo-modal__title">{selectedPromo.title}</h2>
                </div>
              </div>
              
              <div className="promo-modal__body">
                <p className="promo-modal__description">{selectedPromo.description}</p>
                
                <div className="promo-modal__info-grid">
                  <div className="promo-modal__info-item">
                    <Calendar size={18} />
                    <div>
                      <strong>Date & Time</strong>
                      <p>{selectedPromo.date}</p>
                    </div>
                  </div>
                  <div className="promo-modal__info-item">
                    <ExternalLink size={18} />
                    <div>
                      <strong>Location</strong>
                      <p>{selectedPromo.location}</p>
                    </div>
                  </div>
                </div>

                <div className="promo-modal__actions">
                  <button className="promo-modal__close" onClick={() => setSelectedPromo(null)}>
                    Close
                  </button>
                  <button 
                    className="promo-modal__primary" 
                    style={{ background: selectedPromo.color || '#b91c1c' }}
                    onClick={() => {
                      alert(`Interested in ${selectedPromo.title}? Our team will contact you soon!`);
                      setSelectedPromo(null);
                    }}
                  >
                    Confirm Interest
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
