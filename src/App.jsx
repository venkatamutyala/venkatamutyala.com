import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, RefreshCw, AlertCircle, ChevronRight, Newspaper, Calendar, Layers, Moon, Sun } from 'lucide-react';

const INITIAL_FEEDS = [
  { id: '1', name: 'Feed 1', url: 'https://rss.app/feeds/v1.1/_IVI6PHx4cd522mFt.json' },
  { id: '2', name: 'Feed 2', url: 'https://rss.app/feeds/v1.1/_CWNS5Ow7U6sibU2i.json' },
  { id: '3', name: 'Feed 3', url: 'https://rss.app/feeds/v1.1/_sQFQUxzLwF8DlCgT.json' },
  { id: '4', name: 'Feed 4', url: 'https://rss.app/feeds/v1.1/_hSO6WVRr2FWVZBzm.json' },
  { id: '5', name: 'Feed 5', url: 'https://rss.app/feeds/v1.1/YhetfKRWyDHRgnvF.json' },
];

export default function App() {
  const [activeFeedId, setActiveFeedId] = useState(INITIAL_FEEDS[0].id);
  const [feedCache, setFeedCache] = useState({});
  const [globalLoading, setGlobalLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
    
    const promises = INITIAL_FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        return {
          id: feed.id,
          success: true,
          data: {
            ...data,
            lastUpdated: new Date()
          }
        };
      } catch (err) {
        console.error(`Error fetching feed ${feed.id}:`, err);
        return {
          id: feed.id,
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
          title: INITIAL_FEEDS.find(f => f.id === result.id).name
        };
      }
    });

    setFeedCache(newCache);
    setGlobalLoading(false);
  };

  useEffect(() => {
    fetchAllFeeds();
  }, []);

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
  const currentTitle = activeFeedData?.title || INITIAL_FEEDS.find(f => f.id === activeFeedId).name;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors">
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

          {/* Feed Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
            {INITIAL_FEEDS.map((feed) => {
              const cachedFeed = feedCache[feed.id];
              const displayName = cachedFeed?.title || feed.name;
              
              return (
                <button
                  key={feed.id}
                  onClick={() => setActiveFeedId(feed.id)}
                  className={`
                    whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 max-w-[200px] truncate
                    ${activeFeedId === feed.id 
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900' 
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                    }
                  `}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>
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
              const imageUrl = getImageUrl(item);
              const date = item.date_published || item.pubDate;
              const content = item.content_text || item.description || stripHtml(item.content_html);

              return (
                <article 
                  key={item.id || item.guid || index} 
                  className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow duration-300"
                >
                  {/* Image Area */}
                  <a href={item.url || item.link} target="_blank" rel="noopener noreferrer" className="relative block h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                          e.target.parentElement.innerHTML = '<div class="text-slate-400"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <Newspaper className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* Content Area */}
                  <div className="flex-1 p-5 flex flex-col">
                    
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                      {date && (
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {formatDate(date)}
                        </span>
                      )}
                      {item.author && (
                        <span className="truncate max-w-[120px]">
                          • {item.author.name || item.author}
                        </span>
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
                        Read Article
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
