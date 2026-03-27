import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Vote, Plus, Trash2, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ConfirmModal from '../ConfirmModal';

const AdminPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  // Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    pollId: null
  });

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await api.get('/polls/');
      setPolls(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching polls:", err);
      toast.error("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleAddOption = () => {
    setNewPoll({...newPoll, options: [...newPoll.options, '']});
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({...newPoll, options: newOptions});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPoll.options.filter(o => o.trim()).length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }
    try {
      await api.post('/polls/', {
        question: newPoll.question,
        options: newPoll.options.filter(o => o.trim()).map(text => ({ text }))
      });
      toast.success("Poll created successfully!");
      setShowForm(false);
      setNewPoll({ question: '', options: ['', ''] });
      fetchPolls();
    } catch (err) {
      console.error("Error creating poll:", err);
      toast.error("Failed to create poll");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/polls/${id}/`);
      toast.success("Poll deleted");
      fetchPolls();
    } catch (err) {
      console.error("Error deleting poll:", err);
      toast.error("Failed to delete poll");
    }
  };

  return (
    <div className="admin-polls">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, pollId: null })}
        onConfirm={() => handleDelete(confirmModal.pollId)}
        title="Delete Poll"
        message="Are you sure you want to delete this poll? This action cannot be undone."
        confirmText="Delete Poll"
      />
      <div className="admin-section-header">
        <h2>Poll Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Create New Poll'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="What do you want to ask?"
              value={newPoll.question} 
              onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Options</label>
            {newPoll.options.map((option, index) => (
              <div key={index} className="option-input-group" style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={`Option ${index + 1}`}
                  value={option} 
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {newPoll.options.length > 2 && (
                   <button 
                    type="button" 
                    className="btn-icon delete"
                    onClick={() => {
                        const opts = [...newPoll.options];
                        opts.splice(index, 1);
                        setNewPoll({...newPoll, options: opts});
                    }}
                   >
                     <Trash2 size={14} />
                   </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={handleAddOption} style={{marginTop: '0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer'}}>
              + Add Option
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>Create Poll</button>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Votes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {polls.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No polls found</td></tr>
            ) : polls.map((poll) => (
              <tr key={poll.id}>
                <td>
                  <strong>{poll.question}</strong>
                  <div className="poll-options-preview" style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem'}}>
                    {poll.options.map(o => o.text).join(', ')}
                  </div>
                </td>
                <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                     <BarChart2 size={14} />
                     {poll.options.reduce((sum, o) => sum + (o.votes || 0), 0)}
                   </div>
                </td>
                <td><span className="status-badge published">Active</span></td>
                <td>
                  <button className="btn-icon delete" onClick={() => setConfirmModal({ isOpen: true, pollId: poll.id })}>
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

export default AdminPolls;
