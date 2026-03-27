import React from 'react';
import '../App.css'; 

export const SkeletonCard = ({ variant = 'medium' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="skeleton-card skeleton-card--horizontal">
        <div className="skeleton-image skeleton-animate" />
        <div className="skeleton-content">
          <div className="skeleton-block skeleton-meta skeleton-animate" style={{ width: '40%' }} />
          <div className="skeleton-block skeleton-title skeleton-animate" />
          <div className="skeleton-block skeleton-title-short skeleton-animate" />
        </div>
      </div>
    );
  }

  const isLarge = variant === 'large';
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-animate" style={isLarge ? { aspectRatio: '16/9' } : {}} />
      <div className="skeleton-content" style={isLarge ? { padding: '1.5rem' } : {}}>
        <div className="skeleton-block skeleton-meta skeleton-animate" />
        <div className="skeleton-block skeleton-title skeleton-animate" />
        <div className="skeleton-block skeleton-title-short skeleton-animate" />
        {variant !== 'small' && (
          <>
            <div className="skeleton-block skeleton-summary skeleton-animate" style={{ marginTop: '0.5rem' }} />
            <div className="skeleton-block skeleton-summary-short skeleton-animate" />
          </>
        )}
      </div>
    </div>
  );
};
