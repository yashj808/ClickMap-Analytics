import React, { useState, useEffect } from 'react';
import HeatmapCanvas from '../components/HeatmapCanvas';
import { Flame, RefreshCw, Globe, ChevronDown } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Heatmap() {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [clicks, setClicks] = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingClicks, setLoadingClicks] = useState(false);

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

  // Fetch click coordinates for the selected URL
  const fetchClicks = async (url) => {
    if (!url) return;
    setLoadingClicks(true);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`${API_BASE}/api/heatmap?page_url=${encodedUrl}`);
      if (response.ok) {
        const data = await response.json();
        setClicks(data);
      } else {
        console.error('Failed to fetch click coordinates');
      }
    } catch (error) {
      console.error('Error fetching clicks:', error);
    } finally {
      setLoadingClicks(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      fetchClicks(selectedUrl);
    }
  }, [selectedUrl]);

  const handleRefresh = () => {
    fetchUrls();
    if (selectedUrl) {
      fetchClicks(selectedUrl);
    }
  };

  const getUniqueSessionCount = () => {
    const sessions = new Set(clicks.map(c => c.session_id));
    return sessions.size;
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="text-pink-500" size={24} />
            Click Heatmaps
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze where users click, scroll, and focus their visual attention on your pages.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors self-end sm:self-auto"
        >
          <RefreshCw size={13} className={loadingUrls || loadingClicks ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Select Dropdown & Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selector card */}
        <div className="glass-panel p-5 flex flex-col justify-center space-y-2 border border-zinc-800 bg-zinc-950/20">
          <label className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider">
            Select Tracked URL
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

        {/* Stats card 1 */}
        <div className="glass-panel p-5 flex items-center justify-between border border-zinc-800 bg-zinc-950/20">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider">
              Total Clicks
            </span>
            <div className="text-3xl font-extrabold text-pink-500 tracking-tight mt-1">
              {loadingClicks ? '...' : clicks.length}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Flame size={18} />
          </div>
        </div>

        {/* Stats card 2 */}
        <div className="glass-panel p-5 flex items-center justify-between border border-zinc-800 bg-zinc-950/20">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider">
              Unique Interactors
            </span>
            <div className="text-3xl font-extrabold text-indigo-400 tracking-tight mt-1">
              {loadingClicks ? '...' : getUniqueSessionCount()}
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Globe size={18} />
          </div>
        </div>
      </div>

      {/* Main Heatmap Visualizer */}
      <div className="glass-panel p-6 border border-zinc-800 bg-zinc-950/10">
        <HeatmapCanvas clicks={clicks} loading={loadingClicks} url={selectedUrl} />
      </div>
    </div>
  );
}

export default Heatmap;
