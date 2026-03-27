import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield, Mail, Phone, MapPin, Loader2, UserMinus } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchUsers = async (query = '') => {
    try {
      const res = await api.get(`/users/${query ? `?search=${query}` : ''}`);
      setUsers(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAuthor = async (userId) => {
    setTogglingId(userId);
    try {
      const res = await api.post(`/users/${userId}/toggle_author/`);
      toast.success(res.data.status);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_author: res.data.is_author } : u
      ));
    } catch (err) {
      console.error("Error toggling author:", err);
      toast.error("Failed to update author status");
    } finally {
      setTogglingId(null);
    }
  };

  // We now rely on backend search instead of local filtering
  const filteredUsers = users;

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="animate-spin" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <div className="header-info">
          <h2>User Management</h2>
          <p>Total Authors: {users.filter(u => u.is_author).length}</p>
        </div>
        
        <div className="admin-filters">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by username or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-small">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{user.username}</span>
                        <span className="user-id">ID: #{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <Mail size={14} /> <span>{user.email}</span>
                      </div>
                      {user.phone_number && (
                        <div className="contact-item">
                          <Phone size={14} /> <span>{user.phone_number}</span>
                        </div>
                      )}
                      {user.city && (
                        <div className="contact-item">
                          <MapPin size={14} /> <span>{user.city}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="role-badges">
                      {user.is_staff && (
                        <span className="status-badge published">Admin</span>
                      )}
                      {user.is_author ? (
                        <span className="status-badge draft">Author</span>
                      ) : (
                        <span className="status-badge">Reader</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`btn-filter ${user.is_author ? 'active' : ''}`}
                      onClick={() => handleToggleAuthor(user.id)}
                      disabled={togglingId === user.id}
                    >
                      {togglingId === user.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : user.is_author ? (
                        <><UserMinus size={16} /> Demote</>
                      ) : (
                        <><UserCheck size={16} /> Make Author</>
                      ) }
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-table">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
