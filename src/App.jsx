import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, RefreshCw, AlertCircle, ChevronRight, Newspaper, Calendar, Layers, Moon, Sun, Linkedin, Github, Phone, Mail, Play, Pause } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const INITIAL_FEEDS = [
  'https://rss.app/feeds/v1.1/_MzDbCZQhk1JNI0T4.json',
  'https://rss.app/feeds/v1.1/_pSfpwCVBiXyiC8OX.json',
  'https://rss.app/feeds/v1.1/_muBY3IBPymkaXfIL.json',
  'https://rss.app/feeds/v1.1/_8d7YCaSDZsN1hBrX.json',
  'https://rss.app/feeds/v1.1/_Bgt29T7gFAR8KQCX.json',
  'https://rss.app/feeds/v1.1/_hSO6WVRr2FWVZBzm.json',
  'https://rss.app/feeds/v1.1/YhetfKRWyDHRgnvF.json',
  'https://rss.app/feeds/v1.1/_IVI6PHx4cd522mFt.json',
  'https://rss.app/feeds/v1.1/_CWNS5Ow7U6sibU2i.json',
  'https://rss.app/feeds/v1.1/_sQFQUxzLwF8DlCgT.json',
];

export default function App() {
  const [activeFeedId, setActiveFeedId] = useState(0);
  const [feedCache, setFeedCache] = useState({});
  const [globalLoading, setGlobalLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchAllFeeds = async () => {
    setGlobalLoading(true);
    
    const promises = INITIAL_FEEDS.map(async (url, index) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        return {
          id: index,
          success: true,
          data: {
            ...data,
            lastUpdated: new Date()
          }
        };
      } catch (err) {
        console.error(`Error fetching feed ${index}:`, err);
        return {
          id: index,
          success: false,
          error: 'Failed to load feed'
        };
      }
    });

    const results = await Promise.all(promises);
    
    const newCache = {};
    results.forEach(result => {
      if (result.success) {
        newCache[result.id] = result.data;
      } else {
        // Keep existing cache if update fails, or create error state
        newCache[result.id] = {
          error: result.error,
          items: [],
          title: `Feed ${result.id + 1}`
        };
      }
    });

    setFeedCache(newCache);
    setGlobalLoading(false);
  };

  useEffect(() => {
    fetchAllFeeds();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const rotationInterval = setInterval(() => {
      setActiveFeedId((prev) => (prev + 1) % INITIAL_FEEDS.length);
      setRotationProgress(0);
    }, 30000);

    return () => clearInterval(rotationInterval);
  }, [isAutoRotating]);

  // Progress tracking effect
  useEffect(() => {
    if (!isAutoRotating) {
      setRotationProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setRotationProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / 300); // 30 seconds = 300 * 100ms
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAutoRotating]);

  const toggleAutoRotation = () => setIsAutoRotating(!isAutoRotating);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getImageUrl = (item) => {
    if (item.image) return item.image;
    if (item.thumbnail) return item.thumbnail;
    if (item.enclosure?.link && item.enclosure.type?.startsWith('image')) {
      return item.enclosure.link;
    }
    return null;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Get current active feed data from cache
  const activeFeedData = feedCache[activeFeedId];
  const items = activeFeedData?.items || [];
  const error = activeFeedData?.error;
  const lastUpdated = activeFeedData?.lastUpdated;
  const currentTitle = activeFeedData?.title || `Feed ${activeFeedId + 1}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Contact Info Bar */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white py-3 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm">
              These are the various feeds I subscribe to in order to stay up to date.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <a 
                href="https://linkedin.com/in/venkatamutyala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-blue-100 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/venkatamutyala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-blue-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a 
                href="mailto:venkata@venkatamutyala.com" 
                className="flex items-center gap-1.5 hover:text-blue-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </a>
              <a 
                href="tel:+1-517-VEN-KATA" 
                className="flex items-center gap-1.5 hover:text-blue-100 transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+1 517-VEN-KATA</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 sm:mb-0">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 truncate max-w-[200px] sm:max-w-md">
                {globalLoading ? 'Loading Feeds...' : currentTitle}
              </h1>
            </div>
            
            <div className="self-end sm:self-auto flex items-center gap-2">
              <button 
                onClick={toggleAutoRotation}
                className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={isAutoRotating ? "Pause auto-rotation" : "Resume auto-rotation"}
              >
                {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={toggleDarkMode}
                className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button 
                onClick={fetchAllFeeds}
                disabled={globalLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${globalLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{globalLoading ? 'Updating All...' : 'Refresh All'}</span>
              </button>
            </div>
          </div>

          {/* Feed Selector Dropdown */}
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <select
              value={activeFeedId}
              onChange={(e) => setActiveFeedId(Number(e.target.value))}
              className="flex-1 sm:flex-initial sm:min-w-[300px] px-4 py-2 text-sm font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
            >
              {INITIAL_FEEDS.map((url, index) => {
                const cachedFeed = feedCache[index];
                const displayName = cachedFeed?.title || `Feed ${index + 1}`;
                return (
                  <option key={index} value={index}>
                    {displayName}
                  </option>
                );
              })}
            </select>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {activeFeedId + 1} of {INITIAL_FEEDS.length}
            </span>
          </div>
        </div>
        
        {/* Auto-rotation Progress Bar */}
        {isAutoRotating && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-100 ease-linear"
              style={{ width: `${rotationProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button onClick={fetchAllFeeds} className="ml-auto underline font-medium hover:text-red-800 dark:hover:text-red-300">Retry</button>
          </div>
        )}

        {/* Global Loading State Skeleton (Only on first load) */}
        {globalLoading && !activeFeedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden h-96 animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!globalLoading && items.length === 0 && !error && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No articles found in this feed.</p>
          </div>
        )}

        {/* Feed Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const date = item.date_published || item.pubDate;
              const content = item.content_text || item.description || stripHtml(item.content_html);

              return (
                <article 
                  key={item.id || item.guid || index} 
                  className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow duration-300"
                >
                  {/* Content Area */}
                  <div className="flex-1 p-5 flex flex-col">
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-2">
                        {date && (
                          <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                            <Calendar className="w-3 h-3" />
                            {formatDate(date)}
                          </span>
                        )}
                      </div>
                      {(item.url || item.link) && (
                        <div className="flex-shrink-0 bg-white dark:bg-slate-900 p-1 rounded">
                          <QRCodeCanvas 
                            value={item.url || item.link}
                            size={48}
                            level="M"
                            bgColor={darkMode ? "#0f172a" : "#ffffff"}
                            fgColor={darkMode ? "#ffffff" : "#000000"}
                          />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <a href={item.url || item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {content}
                    </p>

                    {/* Footer */}
                    <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <a 
                        href={item.url || item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {(item.authors && item.authors[0]?.name) || item.author?.name || item.author || 'Read Article'}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        
        {lastUpdated && !globalLoading && (
          <div className="mt-12 text-center">
             <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Updated: {lastUpdated.toLocaleTimeString()}
             </p>
          </div>
        )}
      </main>
    </div>
  );
}
