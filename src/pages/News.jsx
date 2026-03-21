import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch news from GNews API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) {
          console.warn('VITE_NEWS_API_KEY not configured');
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://gnews.io/api/v4/search?q=environment%20OR%20recycling&lang=en&apikey=${apiKey}`
        );
        const data = await response.json();
        
        if (data.articles && Array.isArray(data.articles)) {
          const formattedArticles = data.articles.map((article, index) => ({
            id: index,
            title: article.title,
            snippet: article.description || article.content,
            category: 'Eco News',
            date: new Date(article.publishedAt).toLocaleDateString(),
            image: article.image || 'bg-gradient-to-br from-emerald-500 to-cyan-600',
            source: article.source.name,
            url: article.url,
            likes: Math.floor(Math.random() * 1000) + 100
          }));
          setArticles(formattedArticles);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = ['all', 'Eco News', 'Technology', 'Climate', 'Recycling'];
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-emerald-400" />
              Eco News Feed
            </h1>
            <p className="text-slate-400">Stay updated on climate action, sustainability, and environmental innovation</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Latest Updates</p>
            <p className="text-emerald-400 font-semibold">Real-time</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#1e293b] text-slate-300 border border-slate-700/50 hover:bg-slate-700/50'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card text-center py-12">
          <div className="inline-flex items-center gap-2 text-emerald-400">
            <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
            <p className="text-lg font-medium">Loading latest news...</p>
          </div>
        </div>
      )}

      {/* Articles Grid - Masonry Style */}
      {!isLoading && filteredArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div key={article.id} className="card flex flex-col h-full hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all p-0 overflow-hidden">
              {/* Image - Handle both URLs and gradients */}
              {article.image && article.image.startsWith('http') ? (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="aspect-video w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className={`${article.image} aspect-video w-full flex items-center justify-center relative group`}>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    {article.category}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col p-6 bg-[#0d1410]">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
                  {article.snippet}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-t border-slate-700/50 pt-4">
                  <span className="font-medium text-slate-300">{article.source}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{article.likes}</span>
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredArticles.length === 0 && (
        <div className="card text-center py-12">
          <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No articles found</p>
          <button
            onClick={() => setFilter('all')}
            className="btn-primary mt-4"
          >
            View All Articles
          </button>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="card bg-gradient-to-r from-[#050a07] to-[#0d1410] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-slate-400">Get the latest eco news delivered to your inbox</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#1e293b] border border-emerald-500/30 rounded-lg px-4 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button className="btn-primary whitespace-nowrap px-6">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}