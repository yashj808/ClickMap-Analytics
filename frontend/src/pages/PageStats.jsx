import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import ReferrerList from '../components/ReferrerList';
import { BarChart3, RefreshCw, ChevronDown, BookOpen } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function PageStats() {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch unique tracked URLs
  const fetchUrls = async () => {
    setLoadingUrls(true);
    try {
      const response = await fetch(`${API_BASE}/api/heatmap/urls`);
      if (response.ok) {
        const data = await response.json();
        setUrls(data);
        if (data.length > 0 && !selectedUrl) {
          setSelectedUrl(data[0]); // default to first url
        }
      } else {
        console.error('Failed to fetch tracked URLs');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setLoadingUrls(false);
    }
  };

  // Fetch page stats for the selected URL
  const fetchPageStats = async (url) => {
    if (!url) return;
    setLoadingStats(true);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${API_BASE}/api/page-stats?page_url=${encodedUrl}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch page stats');
      }
    } catch (error) {
      console.error('Error fetching page stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      fetchPageStats(selectedUrl);
    }
  }, [selectedUrl]);

  const handleRefresh = () => {
    fetchUrls();
    if (selectedUrl) {
      fetchPageStats(selectedUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="text-indigo-400" size={24} />
            Page Statistics
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze bounce rates, scroll depth milestones, and traffic acquisition referrers per URL.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors self-end sm:self-auto"
        >
          <RefreshCw size={13} className={loadingUrls || loadingStats ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* URL Selector Card */}
      <div className="glass-panel p-5 flex flex-col space-y-2 border border-zinc-800 bg-zinc-950/20 max-w-md">
        <label className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider">
          Select Page URL
        </label>
        <div className="relative">
          <select
            value={selectedUrl}
            onChange={(e) => setSelectedUrl(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer pr-10 font-mono"
            disabled={loadingUrls || urls.length === 0}
          >
            {urls.length === 0 ? (
              <option value="">No pages tracked yet</option>
            ) : (
              urls.map((u, idx) => (
                <option key={idx} value={u}>
                  {u.replace(/^https?:\/\//i, '')}
                </option>
              ))
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Stats Dashboard Section */}
      {stats && !loadingUrls && urls.length > 0 && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <StatsCards stats={stats} loading={loadingStats} />

          {/* Referral Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReferrerList referrers={stats.top_referrers} loading={loadingStats} />
            </div>

            {/* Insight panel */}
            <div className="lg:col-span-1 glass-panel p-6 border border-zinc-800 bg-zinc-950/10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <BookOpen size={16} className="text-indigo-400" />
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Behavioral Insights
                </h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Bounce Rates:</strong> A bounce is flagged when a session contains exactly one event (the initial view). High bounce rates highlight page content that may not align with visitor intent.
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Scroll Depth Milestones:</strong> Tells you if readers are scrolling to the bottom (100%) or exiting near the fold (25%). This is critical for optimizing placement of CTA buttons.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingUrls && urls.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel p-8 border border-zinc-800 bg-zinc-950/20">
          <div className="text-zinc-700 text-4xl mb-3">📈</div>
          <h3 className="text-lg font-semibold text-zinc-300">No Pages Logged</h3>
          <p className="text-sm text-zinc-500 max-w-sm mt-1">
            No events have been captured yet. Open the <a href="http://localhost:4000/demo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">demo page</a> and scroll down or click around to populate analytics stats!
          </p>
        </div>
      )}
    </div>
  );
}

export default PageStats;
