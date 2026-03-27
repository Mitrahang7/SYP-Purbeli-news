import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Newspaper, Edit3, Trash2, Plus, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import '../Admin/Admin.css'; 

import ConfirmModal from '../ConfirmModal';

const AuthorNews = () => {
  const [myNews, setMyNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tag: []
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    postId: null
  });

  const fetchMyNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/my_posts/');
      setMyNews(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching my news:", err);
      toast.error("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      const cats = res.data.results || res.data;
      setCategories(cats);
      if (cats.length > 0) {
        setNewPost(prev => ({ ...prev, category: cats[0].id }));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags/');
      setTags(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  useEffect(() => {
    fetchMyNews();
    fetchCategories();
    fetchTags();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a featured image");
      return;
    }

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('category', newPost.category);
    formData.append('status', 'active');
    
    // Append tags
    newPost.tag.forEach(tagId => {
      formData.append('tag', tagId);
    });
    
    // Omit published_at explicitly -> creates draft.
    formData.append('featured_image', imageFile);

    try {
      await api.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Post drafted successfully!");
      setShowForm(false);
      setNewPost({ title: '', content: '', category: categories.length > 0 ? categories[0].id : '', tag: [] });
      setImageFile(null);
      fetchMyNews();
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post. Remember that image is required.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}/`);
      toast.success("Post deleted");
      fetchMyNews();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="admin-news">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, postId: null })}
        onConfirm={() => handleDelete(confirmModal.postId)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete Post"
      />
      <div className="admin-section-header">
        <h2>My News Articles</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel Form' : 'Write New Article'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{marginBottom: '2rem'}}>
          <div className="form-group">
            <label>Article Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={newPost.title} 
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-input" 
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                required
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Featured Image</label>
              <input 
                type="file" 
                className="form-input" 
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Article Content</label>
            <textarea 
              className="form-textarea" 
              rows="8"
              value={newPost.content} 
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              required
              placeholder="Write your amazing news article here..."
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem', display: 'block' }}>Tags</label>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.75rem', 
              padding: '1.25rem', 
              background: '#f8fafc', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              maxHeight: '180px',
              overflowY: 'auto'
            }}>
              {tags.map(t => (
                <label key={t.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontSize: '0.875rem', 
                  cursor: 'pointer', 
                  color: '#475569',
                  padding: '6px 12px',
                  background: 'white',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <input 
                    type="checkbox" 
                    checked={newPost.tag.includes(t.id)}
                    onChange={(e) => {
                      const updatedTags = e.target.checked 
                        ? [...newPost.tag, t.id]
                        : newPost.tag.filter(id => id !== t.id);
                      setNewPost({ ...newPost, tag: updatedTags });
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  {t.name}
                </label>
              ))}
              {tags.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>No tags available</p>}
            </div>
          </div>

          <button type="submit" className="btn-primary">Save as Draft</button>
        </form>
      )}

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading your articles...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myNews.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>You haven't written any posts yet.</td></tr>
              ) : myNews.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
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
                      <button className="btn-icon delete" onClick={() => setConfirmModal({ isOpen: true, postId: item.id })} title="Delete">
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

export default AuthorNews;
