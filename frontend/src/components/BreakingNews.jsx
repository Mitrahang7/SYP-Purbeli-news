import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import '../styles/Breakingnews.css';

export const BreakingNews = ({ news }) => {
  return (
    <div className="breaking-news">
      <div className="breaking-news__inner">
        <div className="breaking-news__badge">
          <TrendingUp size={12} />
          Breaking
        </div>
        <div className="breaking-news__ticker-wrapper">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="breaking-news__ticker"
          >
            {news.concat(news).map((item, index) => (
              <span key={index} className="breaking-news__ticker-item">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};