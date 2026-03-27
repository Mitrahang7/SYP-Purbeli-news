import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, Trash2, Check, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ConfirmModal from '../ConfirmModal';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    articleId: null
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/admin_posts/');
      setNews(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
      toast.error(`Failed to load news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(item => {
    if (filter === 'drafts') return !item.published_at;
    if (filter === 'published') return !!item.published_at;
    return true;
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const handlePublish = async (id) => {
    try {
      await api.post('/posts/publish/', { id });
      toast.success("News published successfully!");
      fetchNews();
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish news");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}/`);
      toast.success("News deleted successfully!");
      fetchNews();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete news");
    }
  };

  return (
    <div className="admin-news">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, articleId: null })}
        onConfirm={() => handleDelete(confirmModal.articleId)}
        title="Delete Article"
        message="Are you sure you want to delete this news article? This action cannot be undone."
        confirmText="Delete Article"
      />
      <div className="admin-section-header">
        <h2>News Management</h2>
        <div className="admin-filters">
          <button 
            className={`btn-filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn-filter ${filter === 'drafts' ? 'active' : ''}`}
            onClick={() => setFilter('drafts')}
          >
            Drafts
          </button>
          <button 
            className={`btn-filter ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
        </div>
        <button className="btn-icon" onClick={fetchNews} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading news...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No news items found</td></tr>
              ) : filteredNews.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="news-item-info">
                      <strong>{item.title}</strong>
                      <p className="admin-text-muted">By {item.author_name || 'Admin'}</p>
                    </div>
                  </td>
                  <td><span className="category-tag">{item.category_name || 'General'}</span></td>
                  <td>
                    <span className={`status-badge ${item.published_at ? 'published' : 'pending'}`}>
                      {item.published_at ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{item.published_at ? new Date(item.published_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      {!item.published_at && (
                        <button className="btn-icon publish" onClick={() => handlePublish(item.id)} title="Publish Now">
                          <Check size={18} />
                        </button>
                      )}
                      <button className="btn-icon delete" onClick={() => setConfirmModal({ isOpen: true, articleId: item.id })} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
