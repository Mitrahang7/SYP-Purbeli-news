import { useState, useRef, useEffect } from 'react';
import { Search, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/navbar.css';

const CATEGORIES = [
  'Politics', 'Economy', 'Sports', 'Entertainment', 'Technology', 'World'
];

export const NavBar = ({ onCategorySelect, onTagSelect, onAuthClick, onRegisterClick, activeCategory, onSearch, isLoggedIn, isAdmin, isAuthor, username, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tags/');
        const allTags = res.data.results || res.data;
        setTags(allTags.slice(0, 5));
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);

  // Auto-focus input when search bar opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Live search as user types
    if (onSearch) onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch('');
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') handleClearSearch();
  };

  return (
    <header className="navbar">

      {/* Live Ticker */}
      <div className="navbar__ticker">
        <span className="navbar__ticker-dot">●</span>
        LIVE: Prubeli News - Your Voice, Our Vision
      </div>

      <div className="navbar__container">
        <div className="navbar__inner">

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className={`navbar__logo${isSearchOpen ? ' navbar__logo--hidden' : ''}`}
            onClick={() => { onCategorySelect(null); handleClearSearch(); }}
          >
            <h1 className="navbar__logo-text">
              PRUBELI<span className="navbar__logo-accent">NEWS</span>
            </h1>
          </Link>

          {/* Desktop Nav — collapses when search opens */}
          {!isSearchOpen && (
            <nav className="navbar__nav">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className={`navbar__nav-btn${activeCategory === cat ? ' navbar__nav-btn--active' : ''}`}
                >
                  {cat}
                </Link>
              ))}
              
              {/* Trending Tags Dropdown */}
              {tags.length > 0 && (
                <div 
                  className="navbar__nav-dropdown"
                  onMouseEnter={() => setIsTagsDropdownOpen(true)}
                  onMouseLeave={() => setIsTagsDropdownOpen(false)}
                >
                  <button className="navbar__nav-btn navbar__nav-dropdown-toggle">
                    Tags ▾
                  </button>
                  {isTagsDropdownOpen && (
                    <div className="navbar__dropdown-menu">
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          className="navbar__dropdown-item"
                          onClick={() => {
                            if(onTagSelect) onTagSelect(tag.name);
                            setIsTagsDropdownOpen(false);
                          }}
                        >
                          {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          )}

          {/* Expanded Search Bar */}
          {isSearchOpen && (
            <form className="navbar__search-form" onSubmit={handleSearchSubmit}>
              <Search className="navbar__search-form-icon" size={18} />
              <input
                ref={searchInputRef}
                className="navbar__search-input"
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="navbar__search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          )}

          {/* Actions */}
          <div className="navbar__actions">
            <button
              className={`navbar__icon-btn${isSearchOpen ? ' navbar__icon-btn--active' : ''}`}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              onClick={() => isSearchOpen ? handleClearSearch() : setIsSearchOpen(true)}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {isLoggedIn && (isAdmin || isAuthor) && (
              <Link to={isAdmin ? "/admin" : "/author"} className="navbar__admin-link">
                <LayoutDashboard size={16} />
                <span className="navbar__auth-btn-label">{username || (isAdmin ? "Admin" : "Author")}</span>
              </Link>
            )}

            {isLoggedIn ? (
              <button className="navbar__auth-btn" onClick={onLogout}>
                <User size={18} />
                <span className="navbar__auth-btn-label">Logout</span>
              </button>
            ) : (
              <button className="navbar__auth-btn" onClick={onAuthClick}>
                <User size={18} />
                <span className="navbar__auth-btn-label">Login</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar__mobile-menu">

          {/* Mobile Search */}
          <form className="navbar__mobile-search" onSubmit={handleSearchSubmit}>
            <Search className="navbar__mobile-search-icon" size={16} />
            <input
              className="navbar__mobile-search-input"
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                type="button"
                className="navbar__search-clear"
                onClick={handleClearSearch}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Mobile Dashboard Link for Admins/Authors */}
          {isLoggedIn && (isAdmin || isAuthor) && (
            <Link 
              to={isAdmin ? "/admin" : "/author"} 
              className="navbar__mobile-btn" 
              style={{ color: isAdmin ? '#b91c1c' : '#38bdf8', border: `1px solid ${isAdmin ? '#b91c1c' : '#38bdf8'}`, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              {username || (isAdmin ? "Admin Dashboard" : "Author Dashboard")}
            </Link>
          )}

          {/* Mobile Categories */}
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              onClick={() => { onCategorySelect(cat); setIsMenuOpen(false); }}
              className={`navbar__mobile-btn${activeCategory === cat ? ' navbar__mobile-btn--active' : ''}`}
            >
              {cat}
            </Link>
          ))}

          {/* Mobile Trending Tags */}
          {tags.length > 0 && (
            <div className="navbar__mobile-tags">
              <span className="navbar__mobile-tags-title">Tags</span>
              <div className="navbar__mobile-tags-list">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    className="navbar__mobile-tag-btn"
                    onClick={() => {
                      if(onTagSelect) onTagSelect(tag.name);
                      setIsMenuOpen(false);
                    }}
                  >
                    {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </header>
  );
};

export default NavBar;