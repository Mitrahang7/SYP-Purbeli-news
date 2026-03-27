

// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { NavBar } from './components/NavBar';
// import { NewsCard } from './components/Newscard';
// import Footer from './components/Footer';
// import { AdSection } from './components/Adsection';
// import AuthModal from './components/Authmodal';
// import { BreakingNews } from './components/BreakingNews';
// import { MOCK_NEWS } from './data/mockNews';
// import { motion, AnimatePresence } from 'motion/react';
// import { ChevronRight, TrendingUp, Newspaper, Search } from 'lucide-react';
// import './App.css';

// export default function App() {
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [isAuthOpen, setIsAuthOpen] = useState(false);
//   const [selectedArticle, setSelectedArticle] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredNews = useMemo(() => {
//     let news = MOCK_NEWS;
//     if (activeCategory) {
//       news = news.filter(n => n.category === activeCategory);
//     }
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       news = news.filter(n =>
//         n.title.toLowerCase().includes(query) ||
//         n.summary.toLowerCase().includes(query) ||
//         n.content.toLowerCase().includes(query)
//       );
//     }
//     return news;
//   }, [activeCategory, searchQuery]);

//   const breakingNewsItems = MOCK_NEWS
//     .filter(n => n.isBreaking)
//     .map(n => n.title);

//   const trendingNews = MOCK_NEWS.sort((a, b) => b.views - a.views).slice(0, 5);

//   const handleArticleClick = (article) => {
//     setSelectedArticle(article);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setActiveCategory(null);
//     setSelectedArticle(null);
//   };

//   return (
//     <div className="app">
//       <NavBar
//         activeCategory={activeCategory}
//         onCategorySelect={(cat) => {
//           setActiveCategory(cat);
//           setSelectedArticle(null);
//           setSearchQuery('');
//         }}
//         onAuthClick={() => setIsAuthOpen(true)}
//         onSearch={handleSearch}
//       />

//       <BreakingNews news={breakingNewsItems.length > 0 ? breakingNewsItems : ["Welcome to Prubeli News Portal - Your trusted source for Eastern Nepal updates."]} />

//       <main className="app__main">
//         <AnimatePresence mode="wait">
//           {selectedArticle ? (
//             <motion.div
//               key="article"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="app__article-layout"
//             >
//               {/* Article Content */}
//               <div className="app__article-body">
//                 <button
//                   onClick={() => setSelectedArticle(null)}
//                   className="app__back-btn"
//                 >
//                   <ChevronRight className="app__back-icon" size={16} />
//                   Back to News
//                 </button>

//                 <div className="app__article-header">
//                   <span className="app__article-category">
//                     {selectedArticle.category}
//                   </span>
//                   <h1 className="app__article-title">
//                     {selectedArticle.title}
//                   </h1>
//                   <div className="app__article-meta">
//                     <span>By {selectedArticle.author}</span>
//                     <span>•</span>
//                     <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
//                   </div>
//                 </div>

//                 <img
//                   src={selectedArticle.imageUrl}
//                   alt={selectedArticle.title}
//                   className="app__article-image"
//                   referrerPolicy="no-referrer"
//                 />

//                 <div className="app__article-content">
//                   {selectedArticle.content.split('\n').map((p, i) => (
//                     <p key={i} className="app__article-paragraph">{p}</p>
//                   ))}
//                 </div>

//                 <AdSection type="inline" />
//               </div>

//               {/* Article Sidebar */}
//               <aside className="app__article-sidebar">
//                 <AdSection type="sidebar" />

//                 <div className="app__trending-box">
//                   <h3 className="app__trending-title">
//                     <TrendingUp className="app__trending-icon" size={24} />
//                     Trending Now
//                   </h3>
//                   <div className="app__trending-list">
//                     {trendingNews.map((article) => (
//                       <NewsCard
//                         key={article.id}
//                         article={article}
//                         variant="horizontal"
//                         onClick={handleArticleClick}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </aside>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="grid"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="app__grid-view"
//             >
//               {/* Hero Section */}
//               {!activeCategory && MOCK_NEWS.length > 0 && (
//                 <div className="app__hero">
//                   <div className="app__hero-main">
//                     <NewsCard
//                       article={MOCK_NEWS[0]}
//                       variant="large"
//                       onClick={handleArticleClick}
//                     />
//                   </div>
//                   <div className="app__hero-sidebar">
//                     <h3 className="app__latest-heading">Latest Updates</h3>
//                     {MOCK_NEWS.slice(1, 4).map(article => (
//                       <NewsCard
//                         key={article.id}
//                         article={article}
//                         variant="horizontal"
//                         onClick={handleArticleClick}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Main Grid */}
//               <div className="app__stories">
//                 <div className="app__stories-header">
//                   <h2 className="app__stories-title">
//                     <Newspaper className="app__stories-icon" size={32} />
//                     {searchQuery ? `Search: ${searchQuery}` : (activeCategory || 'Top Stories')}
//                   </h2>
//                   <div className="app__stories-decoration">
//                     <div className="app__deco-bar app__deco-bar--red"></div>
//                     <div className="app__deco-bar app__deco-bar--gray"></div>
//                   </div>
//                 </div>

//                 <div className="app__news-grid">
//                   {filteredNews.length > 0 ? (
//                     filteredNews.map((article) => (
//                       <NewsCard
//                         key={article.id}
//                         article={article}
//                         onClick={handleArticleClick}
//                       />
//                     ))
//                   ) : (
//                     <div className="app__empty-state">
//                       <div className="app__empty-icon-wrapper">
//                         <Search size={32} className="app__empty-icon" />
//                       </div>
//                       <h3 className="app__empty-title">No results found</h3>
//                       <p className="app__empty-message">We couldn't find any news matching "{searchQuery}"</p>
//                       <button
//                         onClick={() => setSearchQuery('')}
//                         className="app__clear-btn"
//                       >
//                         Clear Search
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <AdSection type="banner" className="app__banner-ad" />

//               {/* Secondary Grid */}
//               {!activeCategory && (
//                 <div className="app__secondary-grid">
//                   <div className="app__special-section">
//                     <h3 className="app__special-heading">Prubeli Special</h3>
//                     <div className="app__special-grid">
//                       {MOCK_NEWS.filter(n => n.category === 'Prubeli Special').map(article => (
//                         <NewsCard
//                           key={article.id}
//                           article={article}
//                           onClick={handleArticleClick}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <aside className="app__secondary-sidebar">
//                     <div className="app__newsletter">
//                       <div className="app__newsletter-blob"></div>
//                       <h4 className="app__newsletter-title">Subscribe to Newsletter</h4>
//                       <p className="app__newsletter-desc">Get the latest news from Eastern Nepal delivered to your inbox daily.</p>
//                       <div className="app__newsletter-form">
//                         <input
//                           type="email"
//                           placeholder="Your email address"
//                           className="app__newsletter-input"
//                         />
//                         <button className="app__newsletter-btn">
//                           Subscribe Now
//                         </button>
//                       </div>
//                     </div>
//                     <AdSection type="sidebar" />
//                   </aside>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>

//       <Footer />
//       <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from 'react';
import api from './services/api';
import { NavBar } from './components/NavBar';
import { NewsCard } from './components/Newscard';
import { SkeletonCard } from './components/SkeletonCard';
import { Comments } from './components/Comments';
import Footer from './components/Footer';
import { AdSection } from './components/Adsection';
import AuthModal from './components/Authmodal';
import VideoAdModal from './components/VideoAdModal';
import { BreakingNews } from './components/BreakingNews';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, TrendingUp, Newspaper, Search } from 'lucide-react';
import './App.css';
import { SocialShare } from './components/SocialShare';
import { Sidebar } from './components/Sidebar';
import { TopBarWidgets } from './components/TopBarWidgets';
import { getToken, logoutUser, isStaff, isAuthor, getUsername } from "./services/auth";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard';
import AuthorDashboard from './components/Author/AuthorDashboard';
import AboutUs from './components/Static/AboutUs';
import ContactUs from './components/Static/ContactUs';
import { Toaster, toast } from 'react-hot-toast';



export default function App() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUnskippableAuth, setIsUnskippableAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [isVideoAdOpen, setIsVideoAdOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [hasSeenScrollAd, setHasSeenScrollAd] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [isAdmin, setIsAdmin] = useState(isStaff());
  const [isAuthorUser, setIsAuthorUser] = useState(isAuthor());
  const [username, setUsername] = useState(getUsername());
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 🕒 Debounce user typing to prevent API spam
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔥 Fetch posts from Django (Global Database Search & Pagination)
  const fetchPosts = (query = '', pageNum = 1, tag = '') => {
    if (pageNum === 1) setIsLoading(true);
    
    let url = `/posts/?page=${pageNum}`;
    if (query) url += `&search=${encodeURIComponent(query)}`;
    if (tag) url += `&tag=${encodeURIComponent(tag)}`;

    api.get(url)
      .then(res => {
        if (pageNum === 1) {
          setPosts(res.data.results || res.data);
        } else {
          setPosts(prev => [...prev, ...(res.data.results || [])]);
        }
        setHasMore(!!res.data.next);
        setPage(pageNum);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Trigger global search whenever the debounced query changes
  useEffect(() => {
    fetchPosts(debouncedSearchQuery, 1);
  }, [debouncedSearchQuery]);

  // Filter by tag when activeDistrict (tag) changes
  useEffect(() => {
    fetchPosts('', 1, activeDistrict || '');
  }, [activeDistrict]);

  // 🌐 Dynamic SEO Title Injection
  useEffect(() => {
    if (selectedArticle) {
      document.title = `${selectedArticle.title} - Purbeli News`;
    } else if (activeCategory) {
      document.title = `${activeCategory} News - Purbeli News`;
    } else {
      document.title = 'Purbeli News | Digital News Portal';
    }
  }, [selectedArticle, activeCategory]);


  const loadMorePosts = () => {
    if (!hasMore) return;
    fetchPosts(debouncedSearchQuery, page + 1);
  };

  useEffect(() => {
  api.get('/categories/')
    .then(res => {
      setCategories(res.data.results || res.data);
    })
    .catch(err => console.error("Category error:", err));
}, []);

  // 🔧 Format backend data → frontend format
  const formattedPosts = useMemo(() => {
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content || "",
    summary: (post.content || "").slice(0, 150),

    category: categories.find(c => c.id === post.category)?.name || "General",

    imageUrl: post.featured_image || "https://via.placeholder.com/600x400",

    tag: post.tag || [],   // ✅ only once

    date: post.created_at, // ✅ only once

    author: post.author || "Admin",

    views: post.views_count || 0, // ✅ FIXED

    isBreaking: post.is_breaking || false
  }));
}, [posts]);
  // 🔍 Filtering
  const filteredNews = useMemo(() => {
    let news = formattedPosts;

    if (activeCategory) {
      news = news.filter(n => n.category === activeCategory);
    }

    // Backend handles global text search now, so we only filter by activeCategory locally!

    return news;
  }, [formattedPosts, activeCategory]);

  // 🚨 Breaking news
  const breakingNewsItems = formattedPosts
    .filter(n => n.isBreaking)
    .map(n => n.title);

  // 🔥 Trending
  const trendingNews = [...formattedPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // 📚 Related 
  const relatedNews = useMemo(() => {
    if (!selectedArticle) return [];
    return formattedPosts
      .filter(p => p.category === selectedArticle.category && p.id !== selectedArticle.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [selectedArticle, formattedPosts]);

  // 📄 Open article
  const openMandatoryAuth = (msg) => {
    setIsAuthOpen(true);
    setIsUnskippableAuth(true);
    setAuthMessage(msg);
  };

  const requireAdOrLogin = (actionCallback, message) => {
    setPendingAction(() => actionCallback);
    setAuthMessage(message);
    setIsVideoAdOpen(true);
  };

  const performArticleOpen = (article) => {
    setSelectedArticle(article);
    setSummary("");
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track view in backend securely
    api.post(`/posts/${article.id}/view/`).catch(console.error);

    // Optimistically update frontend array so the UI feels instant
    setPosts(prev => prev.map(p => 
      p.id === article.id ? { ...p, views_count: (p.views_count || 0) + 1 } : p
    ));
  };

  const handleArticleClick = (article) => {
    if (!isLoggedIn) {
      requireAdOrLogin(
        () => navigate(`/article/${article.id}`),
        "Please log in or sign up to read full articles."
      );
      return;
    }
    navigate(`/article/${article.id}`);
  };

  // 🔍 Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory(null);
    setSelectedArticle(null);
  };

  // 🔥 Mandatory Login/Ad on 50% Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoggedIn || isAuthOpen || isVideoAdOpen || hasSeenScrollAd) return;
      
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // We check > 50% to show mandatory login
      if (scrollY + viewportHeight >= fullHeight * 0.5) {
        setHasSeenScrollAd(true);
        requireAdOrLogin(
          null,
          "Please log in or sign up to continue exploring updates."
        );
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoggedIn, isAuthOpen, isVideoAdOpen, hasSeenScrollAd]);


  // 🤖 Summarize API call
  const handleSummarize = async (postId) => {
    setIsSummarizing(true);
    setSummary(""); // Clear previous summary if any
    try {
      const res = await api.get(`/summarize/${postId}/`);
      setSummary(res.data.summary);
      toast.success("Successfully summarized article!");
    } catch (err) {
      console.error("Summarize error:", err);
      toast.error("Failed to summarize article. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="app">
      <Toaster 
        position="top-right" 
      />
      
      <NavBar
        activeCategory={activeCategory}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
          navigate('/');
        }}
        onTagSelect={(tag) => {
          setActiveDistrict(tag);
          setActiveCategory(null);
          setSearchQuery('');
          navigate('/');
        }}
        onAuthClick={() => {
          setIsAuthOpen(true);
          setIsUnskippableAuth(false);
          setAuthMessage("");
        }}
        onSearch={handleSearch}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isAuthor={isAuthorUser}
        username={username}
        onLogout={() => {
          logoutUser();
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsAuthorUser(false);
          setUsername(null);
          toast.success("Logged out successfully");
          navigate('/');
        }}
      />

      <BreakingNews
        news={
          trendingNews.length > 0
            ? trendingNews.map(n => n.title)
            : ["Welcome to Purbeli News Portal"]
        }
      />

      <TopBarWidgets />

      <main className="app__main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home Route */}
            <Route path="/" element={
              <motion.div 
                key="grid" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="app__home-layout"
              >
                <div className="app__home-main">
                  <div className="app__news-grid">
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    ) : filteredNews.length > 0 ? (
                      filteredNews.map(article => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onClick={handleArticleClick}
                        />
                      ))
                    ) : (
                      <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#374151' }}>No news found</h3>
                        <p style={{ color: '#6b7280' }}>We couldn't find any articles matching your filters.</p>
                      </div>
                    )}
                  </div>

                  {hasMore && !searchQuery && !activeCategory && (
                    <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                      <button 
                        onClick={loadMorePosts}
                        className="app__load-more"
                      >
                        Load More News ⬇
                      </button>
                    </div>
                  )}
                </div>

                <Sidebar 
                  username={username}
                  trendingNews={trendingNews}
                  activeDistrict={activeDistrict}
                  onDistrictSelect={setActiveDistrict}
                  handleArticleClick={handleArticleClick}
                />
              </motion.div>
            } />

            {/* Article Detail Route */}
            <Route path="/article/:id" element={<ArticleView 
              isLoggedIn={isLoggedIn}
              username={username}
              handleArticleClick={handleArticleClick}
              trendingNews={trendingNews}
              formattedPosts={formattedPosts}
              handleSummarize={handleSummarize}
              summary={summary}
              isSummarizing={isSummarizing}
            />} />

            {/* Category Route */}
            <Route path="/category/:categoryName" element={<CategoryView 
              setActiveCategory={setActiveCategory}
              filteredNews={filteredNews}
              isLoading={isLoading}
              handleArticleClick={handleArticleClick}
              username={username}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
              trendingNews={trendingNews}
            />} />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Admin Route */}
            <Route path="/admin/*" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
            
            {/* Author Route */}
            <Route path="/author/*" element={isAuthorUser || isAdmin ? <AuthorDashboard /> : <Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        unskippable={isUnskippableAuth}
        customMessage={authMessage}
        onClose={() => {
          if (!isUnskippableAuth) setIsAuthOpen(false);
        }} 
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsAdmin(isStaff());
          setIsAuthorUser(isAuthor());
          setUsername(getUsername());
          setIsAuthOpen(false);
          setIsUnskippableAuth(false);
          setAuthMessage("");
          setActiveCategory(null);
          setSelectedArticle(null);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <VideoAdModal 
        isOpen={isVideoAdOpen}
        onSkip={() => {
          setIsVideoAdOpen(false);
          setIsAuthOpen(true);
          setIsUnskippableAuth(true);
        }}
        onFinish={() => {
          setIsVideoAdOpen(false);
          if (pendingAction) {
            pendingAction();
          }
        }}
      />
    </div>
  );
}

// 📄 Extracted Article View Component
function ArticleView({ 
  isLoggedIn, 
  username, 
  handleArticleClick, 
  trendingNews, 
  formattedPosts,
  handleSummarize,
  summary,
  isSummarizing
}) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/${id}/`)
      .then(res => {
        const post = res.data;
        setArticle({
          id: post.id,
          title: post.title,
          content: post.content || "",
          category: post.category_name || "General",
          imageUrl: post.featured_image || "https://via.placeholder.com/600x400",
          date: post.created_at,
          author: post.author || "Admin",
          views: post.views_count || 0,
        });
        api.post(`/posts/${post.id}/view/`).catch(console.error);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        console.error("Error fetching article:", err);
        toast.error("Failed to load article");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const relatedNews = useMemo(() => {
    if (!article) return [];
    return formattedPosts
      .filter(p => p.category === article.category && p.id !== article.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [article, formattedPosts]);

  if (loading) return <div className="app__loading-container"><div className="loader"></div><p>Loading article...</p></div>;
  if (!article) return <div className="app__error-container"><h2>Article not found</h2><button onClick={() => window.history.back()} className="app__back-btn">Go Back</button></div>;

  return (
    <>
      <motion.div
        key="article"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="app__article-layout"
      >
        <div className="app__article-body">
          <button onClick={() => window.history.back()} className="app__back-btn">
            <ChevronRight size={16} /> Back
          </button>

          <h1>{article.title}</h1>
          <p className="app__article-meta-info">{article.category} • {new Date(article.date).toLocaleDateString()}</p>

          <img className="app__article-image" src={article.imageUrl} alt="" />

          <div className="app__article-content">
            {article.content.split('\n').map((p, i) => (
              <p key={i} className="app__article-paragraph">{p}</p>
            ))}
          </div>

          <button 
            className="app__summarize-btn" 
            onClick={() => handleSummarize(article.id)}
            disabled={isSummarizing}
            style={{ opacity: isSummarizing ? 0.7 : 1, cursor: isSummarizing ? 'not-allowed' : 'pointer' }}
          >
            {isSummarizing ? "⏳ Analyzing..." : "✨ Summarize Article with AI"}
          </button>

          {summary && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app__summary-box">
              <h3 className="app__summary-title">✨ AI Summary</h3>
              <p className="app__summary-text">{summary}</p>
            </motion.div>
          )}

          <SocialShare 
            url={window.location.href} 
            title={article.title} 
          />
          <Comments postId={article.id} />
        </div>

        <Sidebar 
          username={username}
          trendingNews={trendingNews}
          handleArticleClick={handleArticleClick}
        />
      </motion.div>

      {relatedNews.length > 0 && (
        <div className="app__related-section">
          <h2>Related Articles</h2>
          <div className="app__news-grid">
            {relatedNews.map(a => (
              <NewsCard key={a.id} article={a} onClick={handleArticleClick} variant="medium" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// 📁 Extracted Category View Component
function CategoryView({ setActiveCategory, filteredNews, isLoading, handleArticleClick, username, activeDistrict, setActiveDistrict, trendingNews }) {
  const { categoryName } = useParams();
  
  useEffect(() => {
    setActiveCategory(categoryName);
  }, [categoryName, setActiveCategory]);

  return (
    <div className="app__home-layout">
      <div className="app__home-main">
        <h2 className="app__section-title">{categoryName} News</h2>
        <div className="app__news-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredNews.length > 0 ? (
            filteredNews.map(article => (
              <NewsCard key={article.id} article={article} onClick={handleArticleClick} />
            ))
          ) : (
            <p>No articles found for this category.</p>
          )}
        </div>
      </div>
      <Sidebar 
        username={username}
        trendingNews={trendingNews}
        activeDistrict={activeDistrict}
        onDistrictSelect={setActiveDistrict}
        handleArticleClick={handleArticleClick}
      />
    </div>
  );
}