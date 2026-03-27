import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import api from '../services/api';
import '../styles/DistrictFilter.css';

export const DistrictFilter = ({ activeDistrict, onDistrictSelect }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tags/');
        const allTags = res.data.results || res.data;
        setTags(allTags.slice(0, 10)); // Show max 10 tags
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);

  if (tags.length === 0) return null;

  return (
    <div className="district-filter">
      <div className="district-filter__header">
        <Tag size={18} />
        <h3>News by Tags</h3>
      </div>
      <div className="district-filter__list">
        <button
          className={`district-filter__item ${!activeDistrict ? 'active' : ''}`}
          onClick={() => onDistrictSelect(null)}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`district-filter__item ${activeDistrict === tag.name ? 'active' : ''}`}
            onClick={() => onDistrictSelect(tag.name)}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};
