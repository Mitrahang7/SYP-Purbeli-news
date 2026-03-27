import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import '../styles/PollWidget.css';

export const PollWidget = ({ username }) => {
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkVotedStatus = (pollId, user) => {
    const key = `poll_voted_${pollId}${user ? `_${user}` : '_anon'}`;
    return localStorage.getItem(key) === 'true';
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await api.get('/polls/');
        const pollsData = res.data.results || res.data;
        if (pollsData && pollsData.length > 0) {
          const latestPoll = pollsData[0];
          setPoll(latestPoll);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching poll:', error);
        setLoading(false);
      }
    };

    fetchPoll();
  }, []);

  // Update voted state when poll or username changes
  useEffect(() => {
    if (poll) {
      setVoted(checkVotedStatus(poll.id, username));
    }
  }, [poll, username]);

  const [voting, setVoting] = useState(false);

  const handleVote = async (optionId) => {
    if (voting) return;
    setVoting(true);
    try {
      const res = await api.post(`/polls/${poll.id}/vote/`, { option_id: optionId });
      setPoll(res.data);
      setVoted(true);
      const key = `poll_voted_${poll.id}${username ? `_${username}` : '_anon'}`;
      localStorage.setItem(key, 'true');
      import('react-hot-toast').then(({ toast }) => toast.success('Vote recorded!'));
    } catch (error) {
      console.error('Error voting:', error);
      import('react-hot-toast').then(({ toast }) => toast.error('Failed to vote. Please try again.'));
    } finally {
      setVoting(false);
    }
  };

  if (loading || !poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="poll-widget">
      <div className="widget-header">
        <BarChart3 className="header-icon" size={18} />
        <span>Today's Poll</span>
      </div>
      
      <div className="poll-card">
        <h3 className="poll-question">{poll.question}</h3>
        
        <div className="poll-options">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            
            return (
              <div key={option.id} className="poll-option-container">
                {voted ? (
                  <div className="poll-result">
                    <div className="poll-result-info">
                      <span className="option-text">{option.text}</span>
                      <span className="option-percentage">{percentage}%</span>
                    </div>
                    <div className="poll-progress-bg">
                      <div 
                        className="poll-progress-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="poll-vote-btn"
                    onClick={() => handleVote(option.id)}
                    disabled={voting}
                  >
                    {option.text}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {voted && (
          <div className="poll-footer">
            <CheckCircle2 size={14} color="#10b981" />
            <span>Thank you for voting! ({totalVotes} votes)</span>
          </div>
        )}
      </div>
    </div>
  );
};
