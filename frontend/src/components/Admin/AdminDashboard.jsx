import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Newspaper, 
  Image as ImageIcon, 
  Vote, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Image, 
  CheckSquare,
  Video
} from 'lucide-react';
import AdminNews from './AdminNews';
import AdminAds from './AdminAds';
import AdminVideoAds from './AdminVideoAds';
import AdminPolls from './AdminPolls';
import AdminUsers from './AdminUsers';
import { Users } from 'lucide-react';
import api from '../../services/api'; // Added api import
import './Admin.css';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/news', icon: <Newspaper size={20} />, label: 'News Management' },
    { path: '/admin/ads', icon: <ImageIcon size={20} />, label: 'Ad Management' },
    { path: '/admin/video-ads', icon: <Video size={20} />, label: 'Video Ads' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
    { path: '/admin/polls', icon: <Vote size={20} />, label: 'Poll Management' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <span className="logo-accent">Purbeli</span> Admin
      </div>
      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <Link to="/" className="admin-sidebar__link">
          <LogOut size={20} />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState([
    { label: 'Total News', value: '...', icon: <Newspaper />, color: '#3b82f6' },
    { label: 'Authors', value: '...', icon: <Users />, color: '#f43f5e' },
    { label: 'Active Ads', value: '...', icon: <ImageIcon />, color: '#10b981' },
    { label: 'Video Ads', value: '...', icon: <Video />, color: '#8b5cf6' },
    { label: 'Total Polls', value: '...', icon: <Vote />, color: '#f59e0b' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, adsRes, videoAdsRes, pollsRes, authorsRes] = await Promise.all([
          api.get('/posts/'),
          api.get('/promotions/'),
          api.get('/video-ads/'),
          api.get('/polls/'),
          api.get('/users/author_count/')
        ]);

        setStats([
          { 
            label: 'Total News', 
            value: newsRes.data.count || (Array.isArray(newsRes.data) ? newsRes.data.length : newsRes.data.results?.length || 0), 
            icon: <Newspaper />, 
            color: '#3b82f6' 
          },
          { 
            label: 'Authors', 
            value: authorsRes.data.count || 0, 
            icon: <Users />, 
            color: '#f43f5e' 
          },
          { 
            label: 'Active Ads', 
            value: adsRes.data.count || (Array.isArray(adsRes.data) ? adsRes.data.length : adsRes.data.results?.length || 0), 
            icon: <ImageIcon />, 
            color: '#10b981' 
          },
          { 
            label: 'Video Ads', 
            value: videoAdsRes.data.count || (Array.isArray(videoAdsRes.data) ? videoAdsRes.data.length : videoAdsRes.data.results?.length || 0), 
            icon: <Video />, 
            color: '#8b5cf6' 
          },
          { 
            label: 'Total Polls', 
            value: pollsRes.data.count || (Array.isArray(pollsRes.data) ? pollsRes.data.length : pollsRes.data.results?.length || 0), 
            icon: <Vote />, 
            color: '#f59e0b' 
          },
        ]);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-overview">
      <h2>Welcome to Admin Dashboard</h2>
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ backgroundColor: stat.color + '22', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="admin-stat-info">
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__title">
            <h1>Admin Panel</h1>
            <p>Manage your portal content effectively</p>
          </div>
          <div className="admin-user-profile">
            <div className="admin-user-avatar">AD</div>
            <span>Administrator</span>
          </div>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/news" element={<AdminNews />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/ads" element={<AdminAds />} />
            <Route path="/video-ads" element={<AdminVideoAds />} />
            <Route path="/polls" element={<AdminPolls />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
