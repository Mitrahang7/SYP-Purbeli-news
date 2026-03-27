import React from 'react';
import { Share2, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import '../styles/SocialShare.css';

export const SocialShare = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="social-share">
      <div className="social-share__label">
        <Share2 size={18} />
        <span>Share this story</span>
      </div>
      <div className="social-share__buttons">
        <a 
          href={shareLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-share__btn social-share__btn--facebook"
          title="Share on Facebook"
        >
          <Facebook size={20} />
        </a>
        <a 
          href={shareLinks.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-share__btn social-share__btn--whatsapp"
          title="Share on WhatsApp"
        >
          <MessageCircle size={20} />
        </a>
        <button 
          onClick={handleCopy} 
          className="social-share__btn social-share__btn--copy"
          title="Copy Link"
        >
          {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
};
