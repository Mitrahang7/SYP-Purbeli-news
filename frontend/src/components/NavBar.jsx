import { useState, useRef, useEffect } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import '../styles/navbar.css';

const CATEGORIES = [
  'Politics', 'Economy', 'Sports', 'Entertainment', 'Technology', 'World', 'Prubeli Special'
];

export const NavBar = ({ onCategorySelect, onAuthClick, activeCategory, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

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
          <div
            className={`navbar__logo${isSearchOpen ? ' navbar__logo--hidden' : ''}`}
            onClick={() => { onCategorySelect(null); handleClearSearch(); }}
          >
            <h1 className="navbar__logo-text">
              PRUBELI<span className="navbar__logo-accent">NEWS</span>
            </h1>
          </div>

          {/* Desktop Nav — collapses when search opens */}
          {!isSearchOpen && (
            <nav className="navbar__nav">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className={`navbar__nav-btn${activeCategory === cat ? ' navbar__nav-btn--active' : ''}`}
                >
                  {cat}
                </button>
              ))}
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

            <button className="navbar__auth-btn" onClick={onAuthClick}>
              <User size={18} />
              <span className="navbar__auth-btn-label">Login</span>
            </button>
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

          {/* Mobile Categories */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { onCategorySelect(cat); setIsMenuOpen(false); }}
              className={`navbar__mobile-btn${activeCategory === cat ? ' navbar__mobile-btn--active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

    </header>
  );
};

export default NavBar;