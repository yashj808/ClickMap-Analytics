import React from 'react';
import { ExternalLink, Compass } from 'lucide-react';

function ReferrerList({ referrers, loading }) {
  const getCleanDomain = (urlStr) => {
    if (!urlStr) return 'Direct / Bookmark Traffic';
    try {
      const url = new URL(urlStr);
      return url.hostname;
    } catch (e) {
      return urlStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-zinc-500">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-2"></div>
        <span className="text-xs font-mono">Loading referrers...</span>
      </div>
    );
  }

  // Filter out any null or empty referrers
  const activeReferrers = referrers ? referrers.filter((r) => r && r !== '') : [];

  if (activeReferrers.length === 0) {
    return (
      <div className="py-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl bg-zinc-950/10">
        <Compass className="mx-auto mb-2 text-zinc-700" size={20} />
        <span>No external referrers tracked. All recorded visits are direct traffic.</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/20 overflow-hidden">
      <div className="px-4 py-3 bg-zinc-900/30 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Top Referrers
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">
          Sorted by volume
        </span>
      </div>
      <ul className="divide-y divide-zinc-900/60 text-sm">
        {activeReferrers.map((referrer, idx) => (
          <li 
            key={idx} 
            className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-600 w-4">
                #{idx + 1}
              </span>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-300 font-mono">
                  {getCleanDomain(referrer)}
                </p>
                <p 
                  className="text-[10px] text-zinc-500 truncate max-w-[280px] sm:max-w-md font-mono" 
                  title={referrer}
                >
                  {referrer}
                </p>
              </div>
            </div>
            <a
              href={referrer}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              title={`Visit ${referrer}`}
            >
              <ExternalLink size={13} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReferrerList;
