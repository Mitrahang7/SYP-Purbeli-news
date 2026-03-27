import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';
import api from '../services/api';
import '../styles/VideoAdModal.css';

export default function VideoAdModal({ isOpen, onSkip, onFinish }) {
  const [ad, setAd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state
      setTimeLeft(5);
      setCanSkip(false);
      setIsPlaying(false);
      
      // Fetch active ad
      api.get('/video-ads/')
        .then(res => {
          if (res.data && res.data.results && res.data.results.length > 0) {
            setAd(res.data.results[0]); 
          } else if (res.data && res.data.length > 0) {
            setAd(res.data[0]); 
          } else {
            // No ad available, just finish immediately
            onFinish();
          }
        })
        .catch(err => {
          console.error("Failed to fetch ad", err);
          onFinish(); // Fallback if ad request fails
        });
    } else {
        setAd(null);
    }
  }, [isOpen, onFinish]);

  // Handle countdown
  useEffect(() => {
    if (!isOpen || !isPlaying || canSkip) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, canSkip]);

  const handleVideoEnd = () => {
    onFinish();
  };

  const startVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Autoplay prevented', err));
    }
  };

  if (!isOpen || !ad) return null;

  const videoSource = ad.video_file || ad.video_url || "https://www.w3schools.com/html/mov_bbb.mp4";

  return (
    <AnimatePresence>
      <div className="video-ad-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="video-ad-backdrop"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="video-ad-container"
        >
          <div className="video-ad-header">
            <h3 className="video-ad-title">Sponsored Advertisement</h3>
            <button 
              className={`video-ad-skip-btn ${canSkip ? 'active' : 'disabled'}`}
              onClick={() => { if(canSkip) onSkip(); }}
              disabled={!canSkip}
            >
              {canSkip ? (
                <>Skip Ad <X size={16} /></>
              ) : (
                `Skip in ${timeLeft}s`
              )}
            </button>
          </div>

          <div className="video-ad-player-wrapper">
            {!isPlaying && (
              <button className="video-ad-play-overlay" onClick={startVideo}>
                <Play size={48} />
                <span>Click to Play Ad</span>
              </button>
            )}
            <video 
              ref={videoRef}
              className="video-ad-element"
              src={videoSource}
              onEnded={handleVideoEnd}
              playsInline
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              autoPlay
            />
          </div>
          
          <div className="video-ad-footer">
            <h4>{ad.title}</h4>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
