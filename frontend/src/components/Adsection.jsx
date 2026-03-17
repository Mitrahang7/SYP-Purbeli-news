
import '../styles/Adsection.css';

export const AdSection = ({ type, className = '' }) => {
  return (
    <div className={`ad-section ad-section--${type} ${className}`}>
      <div className="ad-section__content">
        <p className="ad-section__label">Advertisement</p>
        <p className="ad-section__tagline">Space available for your brand</p>
        <button className="ad-section__cta">Contact Sales</button>
      </div>
    </div>
  );
};