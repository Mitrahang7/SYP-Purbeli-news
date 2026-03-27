import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Megaphone, Plus, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ConfirmModal from '../ConfirmModal';

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAd, setNewAd] = useState({
    title: '',
    subtitle: '',
    date: '',
    location: '',
    description: '',
    type: 'Event',
    color: '#4f46e5'
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    adId: null
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/promotions/');
      setAds(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching ads:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newAd).forEach(key => formData.append(key, newAd[key]));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await api.post('/promotions/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Promotion posted successfully!");
      setShowForm(false);
      setNewAd({ title: '', subtitle: '', date: '', location: '', description: '', type: 'Event', color: '#4f46e5' });
      setImageFile(null);
      setImagePreview(null);
      fetchAds();
    } catch (err) {
      console.error("Error posting ad:", err);
      toast.error("Failed to post promotion");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/promotions/${id}/`);
      toast.success("Promotion deleted");
      fetchAds();
    } catch (err) {
      console.error("Error deleting ad:", err);
      toast.error("Failed to delete promotion");
    }
  };

  return (
    <div className="admin-ads">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, adId: null })}
        onConfirm={() => handleDelete(confirmModal.adId)}
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion? This action cannot be undone."
        confirmText="Delete Promotion"
      />
      <div className="admin-section-header">
        <h2>Ad Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Post New Ad'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Ad Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={newAd.title} 
                onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Subtitle / Slogan</label>
              <input 
                type="text" 
                className="form-input" 
                value={newAd.subtitle} 
                onChange={(e) => setNewAd({...newAd, subtitle: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Date / Duration</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. April 10 - 20"
                value={newAd.date} 
                onChange={(e) => setNewAd({...newAd, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="form-input" 
                value={newAd.location} 
                onChange={(e) => setNewAd({...newAd, location: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-textarea" 
              rows="3"
              value={newAd.description} 
              onChange={(e) => setNewAd({...newAd, description: e.target.value})}
            ></textarea>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Type</label>
              <select 
                className="form-select"
                value={newAd.type}
                onChange={(e) => setNewAd({...newAd, type: e.target.value})}
              >
                <option value="Event">Event</option>
                <option value="Promotion">Promotion</option>
                <option value="Special">Special</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
            <div className="form-group">
              <label>Theme Color</label>
              <input 
                type="color" 
                className="form-input color-input" 
                value={newAd.color} 
                onChange={(e) => setNewAd({...newAd, color: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Promotion Image</label>
            <input 
              type="file" 
              className="form-input" 
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button type="button" className="btn-remove-image" onClick={() => {setImageFile(null); setImagePreview(null);}}>Remove</button>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary">Post Promotion</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad Detail</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No active promotions found</td></tr>
            ) : ads.map((ad) => (
              <tr key={ad.id}>
                <td>
                  <div className="ad-info">
                    <strong>{ad.title}</strong>
                    <p className="admin-text-muted">{ad.subtitle}</p>
                  </div>
                </td>
                <td>
                  <span className="type-tag" style={{backgroundColor: ad.color + '22', color: ad.color}}>
                    {ad.type}
                  </span>
                </td>
                <td><span className="status-badge published">Active</span></td>
                <td>
                  <button className="btn-icon delete" onClick={() => setConfirmModal({ isOpen: true, adId: ad.id })}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAds;
