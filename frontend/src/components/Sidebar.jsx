import React from 'react';
import { TrendingUp, Flame, Activity } from 'lucide-react';
import { LocalPromotions } from './LocalPromotions';
import { PollWidget } from './PollWidget';
import { DistrictFilter } from './DistrictFilter';
import { EmergencyHub } from './EmergencyHub';
import { NewsCard } from './Newscard';
import '../styles/Sidebar.css';

export const Sidebar = ({ 
  username, 
  trendingNews = [], 
  activeDistrict, 
  onDistrictSelect,
  showTrending = true,
  handleArticleClick
}) => {
  return (
    <aside className="sidebar-container">
      {/* 2. Featured Content / Advertising (Premium Banner) */}
      <section className="sidebar-section featured-promo">
        <LocalPromotions />
      </section>

      {/* 4. Community Engagement - Moved Up */}
      <section className="sidebar-section engagement">
        <PollWidget username={username} />
      </section>

      {/* 3. Trending News (Social Proof) */}
      {showTrending && trendingNews.length > 0 && (
        <section className="sidebar-section trending-box">
          <div className="section-header">
            <TrendingUp size={20} className="icon-red" />
            <h3 className="section-title">Trending Now</h3>
          </div>
          <div className="trending-list">
            {trendingNews.map((article, index) => (
              <div key={article.id} className="trending-item">
                <span className="trending-rank">0{index + 1}</span>
                <NewsCard 
                  article={article} 
                  variant="horizontal-mini" 
                  onClick={handleArticleClick} 
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Utility & Region */}
      <section className="sidebar-section utils">
        <div className="section-header">
          <Flame size={16} className="icon-red" />
          <h3 className="section-title">Region & Safety</h3>
        </div>
        <div className="mt-4">
          <EmergencyHub />
        </div>
      </section>
      
      <div className="sidebar-sticky-end">
        <div className="sidebar-footer">
          © 2026 Purbeli News • All Rights Reserved
        </div>
      </div>
    </aside>
  );
};
