import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Video, Plus, Trash2, Check, X as XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ConfirmModal from '../ConfirmModal';

const AdminVideoAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  
  const [newAd, setNewAd] = useState({
    title: '',
    video_url: '',
    is_active: true
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    adId: null
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/video-ads/');
      setAds(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching video ads:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile && !newAd.video_url) {
      toast.error("Please provide either a video file or a video URL.");
      return;
    }

    const formData = new FormData();
    formData.append('title', newAd.title);
    formData.append('is_active', newAd.is_active);
    
    if (newAd.video_url) {
      formData.append('video_url', newAd.video_url);
    }
    if (videoFile) {
      formData.append('video_file', videoFile);
    }

    try {
      await api.post('/video-ads/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Video Ad posted successfully!");
      setShowForm(false);
      setNewAd({ title: '', video_url: '', is_active: true });
      setVideoFile(null);
      fetchAds();
    } catch (err) {
      console.error("Error posting video ad:", err);
      toast.error("Failed to post video ad");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/video-ads/${id}/`);
      toast.success("Video Ad deleted");
      fetchAds();
    } catch (err) {
      console.error("Error deleting video ad:", err);
      toast.error("Failed to delete video ad");
    }
  };

  const toggleActive = async (ad) => {
    try {
      await api.patch(`/video-ads/${ad.id}/`, { is_active: !ad.is_active });
      toast.success(`Video Ad ${!ad.is_active ? 'activated' : 'deactivated'}`);
      fetchAds();
    } catch (err) {
      console.error("Error toggling ad status:", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="admin-ads">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, adId: null })}
        onConfirm={() => handleDelete(confirmModal.adId)}
        title="Delete Video Ad"
        message="Are you sure you want to delete this video ad? This action cannot be undone."
        confirmText="Delete Video Ad"
      />
      <div className="admin-section-header">
        <h2>Video Ad Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add New Video Ad'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
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
          
          <div className="form-grid">
            <div className="form-group">
              <label>Video URL (External)</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://example.com/video.mp4"
                value={newAd.video_url} 
                onChange={(e) => setNewAd({...newAd, video_url: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Upload Video File</label>
              <input 
                type="file" 
                className="form-input" 
                accept="video/*"
                onChange={handleFileChange}
              />
              {videoFile && <small style={{display: 'block', marginTop: '5px', color: '#888'}}>Selected: {videoFile.name}</small>}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              id="isActiveAd"
              checked={newAd.is_active} 
              onChange={(e) => setNewAd({...newAd, is_active: e.target.checked})}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="isActiveAd" style={{ margin: 0, cursor: 'pointer' }}>Set as Active immediately</label>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>Save Video Ad</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad Title</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
            ) : ads.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No video ads found</td></tr>
            ) : ads.map((ad) => (
              <tr key={ad.id}>
                <td>
                  <strong>{ad.title}</strong>
                </td>
                <td>
                  <span className="admin-text-muted" style={{ fontSize: '0.85rem', wordBreak: 'break-all'}}>
                    {ad.video_file ? 'Uploaded File' : (ad.video_url || 'N/A')}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => toggleActive(ad)}
                    className={`status-badge ${ad.is_active ? 'published' : 'draft'}`}
                    style={{ cursor: 'pointer', border: 'none', background: ad.is_active ? '#10b98122' : '#f43f5e22', color: ad.is_active ? '#10b981' : '#f43f5e' }}
                  >
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <button className="btn-icon delete" onClick={() => setConfirmModal({ isOpen: true, adId: ad.id })} title="Delete Ad">
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

export default AdminVideoAds;
