import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import '../styles/Comments.css';

export const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/posts/${postId}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/posts/${postId}/comments/`, formData);
      setComments([res.data, ...comments]); // Prepend new comment securely
      setFormData({ name: '', email: '', comment: '' });
      toast.success('Comment posted safely!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <MessageSquare size={24} className="comments-icon" />
        <h3>Discussion ({comments.length})</h3>
      </div>

      <form className="comments-form" onSubmit={handleSubmit}>
        <div className="comments-form-row">
          <input 
            type="text" 
            placeholder="Your Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <textarea 
          placeholder="What are your thoughts?" 
          rows="4"
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          required
        ></textarea>
        <button type="submit" className="comments-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : <><Send size={16} /> Post Comment</>}
        </button>
      </form>

      <div className="comments-list">
        {isLoading ? (
          <p className="comments-loading">Loading discussion...</p>
        ) : comments.length === 0 ? (
          <p className="comments-empty">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="comment-card">
              <div className="comment-avatar">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <strong>{c.name}</strong>
                  <span>{formatDistanceToNow(new Date(c.created_at))} ago</span>
                </div>
                <p className="comment-text">{c.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
