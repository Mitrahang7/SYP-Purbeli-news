import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Adsection.css';

export const AdSection = ({ type, className = '' }) => {
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await api.get('/promotions/');
        const promotions = res.data.results || res.data;
        if (promotions.length > 0) {
          // Pick a random promotion
          const randomPromo = promotions[Math.floor(Math.random() * promotions.length)];
          setPromo(randomPromo);
        }
      } catch (err) {
        console.error("Error fetching ads for section:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromo();
  }, []);

  if (loading || !promo) {
    return (
      <div className={`ad-section ad-section--${type} ${className}`}>
        <div className="ad-section__content">
          <p className="ad-section__label">Advertisement</p>
          <p className="ad-section__tagline">Space available for your brand</p>
          <button className="ad-section__cta">Contact Sales</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`ad-section ad-section--${type} ${className}`}
      style={{ backgroundImage: promo.image ? `url(${promo.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="ad-section__overlay" style={{ backgroundColor: promo.color + 'CC' }}>
        <div className="ad-section__content">
          <p className="ad-section__label">{promo.type}</p>
          <h4 className="ad-section__promo-title">{promo.title}</h4>
          <p className="ad-section__tagline">{promo.subtitle}</p>
          <button className="ad-section__cta" style={{ backgroundColor: promo.color }}>Learn More</button>
        </div>
      </div>
    </div>
  );
};