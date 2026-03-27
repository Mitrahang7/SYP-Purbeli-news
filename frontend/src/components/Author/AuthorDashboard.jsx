import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Newspaper, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import AuthorNews from './AuthorNews';
import api from '../../services/api'; 
import '../Admin/Admin.css'; // Reusing admin styles

const AuthorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/author', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/author/news', icon: <Newspaper size={20} />, label: 'My News' }
  ];

  return (
    <div className="admin-sidebar" style={{ background: '#1e293b' }}>
      <div className="admin-sidebar__logo">
        <span className="logo-accent" style={{ color: '#38bdf8' }}>Purbeli</span> Author
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
          <span>Exit Author Panel</span>
        </Link>
      </div>
    </div>
  );
};

const AuthorOverview = () => {
  const [stats, setStats] = useState([
    { label: 'My Published Posts', value: '...', icon: <Newspaper />, color: '#38bdf8' },
    { label: 'My Drafts', value: '...', icon: <Newspaper />, color: '#94a3b8' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/posts/my_posts/');
        const allPosts = res.data.results || res.data;
        const publishedCount = allPosts.filter(p => !!p.published_at).length;
        const draftCount = allPosts.filter(p => !p.published_at).length;

        setStats([
          { label: 'My Published Posts', value: publishedCount, icon: <Newspaper />, color: '#38bdf8' },
          { label: 'My Drafts', value: draftCount, icon: <Newspaper />, color: '#94a3b8' }
        ]);
      } catch (err) {
        console.error("Error fetching author stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-overview">
      <h2>Welcome to Author Dashboard</h2>
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

const AuthorDashboard = () => {
  const username = localStorage.getItem('username') || "Author";
  
  return (
    <div className="admin-container">
      <AuthorSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__title">
            <h1>Welcome, {username}</h1>
            <p>Manage and create your news content directly</p>
          </div>
          <div className="admin-user-profile">
            <div className="admin-user-avatar" style={{ background: '#38bdf8' }}>
              {username.slice(0, 2).toUpperCase()}
            </div>
            <span>{username}</span>
          </div>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AuthorOverview />} />
            <Route path="/news" element={<AuthorNews />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AuthorDashboard;
