import { formatDistanceToNow } from 'date-fns';
import { Eye, Clock } from 'lucide-react';
import '../styles/Newscard.css';

export const NewsCard = ({ article, onClick, variant = 'medium' }) => {
  if (variant === 'horizontal') {
    return (
      <div
        className="news-card-horizontal"
        onClick={() => onClick(article)}
      >
        <div className="news-card-horizontal__image-wrapper">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="news-card-horizontal__image"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="news-card-horizontal__body">
          <span className="news-card__category-label">
            {article.category}
          </span>
          <h3 className="news-card-horizontal__title">
            {article.title}
          </h3>
          <div className="news-card__meta">
            <span className="news-card__meta-item">
              <Clock size={10} />
              {formatDistanceToNow(new Date(article.date))} ago
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="news-card"
      onClick={() => onClick(article)}
    >
      <div className={variant === 'large' ? 'news-card__image-wrapper--large' : 'news-card__image-wrapper'}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="news-card__image"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="news-card__body">
        <div className="news-card__header">
          <span className="news-card__category-badge">
            {article.category}
          </span>
          {article.isBreaking && (
            <span className="news-card__breaking-badge">
              <span className="news-card__breaking-dot" />
              BREAKING
            </span>
          )}
        </div>
        <h3 className={variant === 'large' ? 'news-card__title--large' : 'news-card__title'}>
          {article.title}
        </h3>
        {variant !== 'small' && (
          <p className="news-card__summary">
            {article.summary}
          </p>
        )}
        <div className="news-card__footer">
          <span className="news-card__meta-item">
            <Clock size={12} />
            {formatDistanceToNow(new Date(article.date))} ago
          </span>
          <span className="news-card__meta-item">
            <Eye size={12} />
            {article.views.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};