// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import NavBar from "./components/NavBar";
// import Footer from "./components/Footer";

// function App() {
//   return (
//     <Router>
//       <NavBar />
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

import { useState, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { NewsCard } from './components/Newscard';
import Footer from './components/Footer';
import { AdSection } from './components/Adsection';
import AuthModal from './components/Authmodal';
import { BreakingNews } from './components/BreakingNews';
import { MOCK_NEWS } from './data/mockNews';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, TrendingUp, Newspaper, Search } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    let news = MOCK_NEWS;
    if (activeCategory) {
      news = news.filter(n => n.category === activeCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      news = news.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.summary.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    }
    return news;
  }, [activeCategory, searchQuery]);

  const breakingNewsItems = MOCK_NEWS
    .filter(n => n.isBreaking)
    .map(n => n.title);

  const trendingNews = MOCK_NEWS.sort((a, b) => b.views - a.views).slice(0, 5);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory(null);
    setSelectedArticle(null);
  };

  return (
    <div className="app">
      <NavBar
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          setSelectedArticle(null);
          setSearchQuery('');
        }}
        onAuthClick={() => setIsAuthOpen(true)}
        onSearch={handleSearch}
      />

      <BreakingNews news={breakingNewsItems.length > 0 ? breakingNewsItems : ["Welcome to Prubeli News Portal - Your trusted source for Eastern Nepal updates."]} />

      <main className="app__main">
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <motion.div
              key="article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="app__article-layout"
            >
              {/* Article Content */}
              <div className="app__article-body">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="app__back-btn"
                >
                  <ChevronRight className="app__back-icon" size={16} />
                  Back to News
                </button>

                <div className="app__article-header">
                  <span className="app__article-category">
                    {selectedArticle.category}
                  </span>
                  <h1 className="app__article-title">
                    {selectedArticle.title}
                  </h1>
                  <div className="app__article-meta">
                    <span>By {selectedArticle.author}</span>
                    <span>•</span>
                    <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="app__article-image"
                  referrerPolicy="no-referrer"
                />

                <div className="app__article-content">
                  {selectedArticle.content.split('\n').map((p, i) => (
                    <p key={i} className="app__article-paragraph">{p}</p>
                  ))}
                </div>

                <AdSection type="inline" />
              </div>

              {/* Article Sidebar */}
              <aside className="app__article-sidebar">
                <AdSection type="sidebar" />

                <div className="app__trending-box">
                  <h3 className="app__trending-title">
                    <TrendingUp className="app__trending-icon" size={24} />
                    Trending Now
                  </h3>
                  <div className="app__trending-list">
                    {trendingNews.map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                        onClick={handleArticleClick}
                      />
                    ))}
                  </div>
                </div>
              </aside>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="app__grid-view"
            >
              {/* Hero Section */}
              {!activeCategory && MOCK_NEWS.length > 0 && (
                <div className="app__hero">
                  <div className="app__hero-main">
                    <NewsCard
                      article={MOCK_NEWS[0]}
                      variant="large"
                      onClick={handleArticleClick}
                    />
                  </div>
                  <div className="app__hero-sidebar">
                    <h3 className="app__latest-heading">Latest Updates</h3>
                    {MOCK_NEWS.slice(1, 4).map(article => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                        onClick={handleArticleClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Grid */}
              <div className="app__stories">
                <div className="app__stories-header">
                  <h2 className="app__stories-title">
                    <Newspaper className="app__stories-icon" size={32} />
                    {searchQuery ? `Search: ${searchQuery}` : (activeCategory || 'Top Stories')}
                  </h2>
                  <div className="app__stories-decoration">
                    <div className="app__deco-bar app__deco-bar--red"></div>
                    <div className="app__deco-bar app__deco-bar--gray"></div>
                  </div>
                </div>

                <div className="app__news-grid">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        onClick={handleArticleClick}
                      />
                    ))
                  ) : (
                    <div className="app__empty-state">
                      <div className="app__empty-icon-wrapper">
                        <Search size={32} className="app__empty-icon" />
                      </div>
                      <h3 className="app__empty-title">No results found</h3>
                      <p className="app__empty-message">We couldn't find any news matching "{searchQuery}"</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="app__clear-btn"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <AdSection type="banner" className="app__banner-ad" />

              {/* Secondary Grid */}
              {!activeCategory && (
                <div className="app__secondary-grid">
                  <div className="app__special-section">
                    <h3 className="app__special-heading">Prubeli Special</h3>
                    <div className="app__special-grid">
                      {MOCK_NEWS.filter(n => n.category === 'Prubeli Special').map(article => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onClick={handleArticleClick}
                        />
                      ))}
                    </div>
                  </div>

                  <aside className="app__secondary-sidebar">
                    <div className="app__newsletter">
                      <div className="app__newsletter-blob"></div>
                      <h4 className="app__newsletter-title">Subscribe to Newsletter</h4>
                      <p className="app__newsletter-desc">Get the latest news from Eastern Nepal delivered to your inbox daily.</p>
                      <div className="app__newsletter-form">
                        <input
                          type="email"
                          placeholder="Your email address"
                          className="app__newsletter-input"
                        />
                        <button className="app__newsletter-btn">
                          Subscribe Now
                        </button>
                      </div>
                    </div>
                    <AdSection type="sidebar" />
                  </aside>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}