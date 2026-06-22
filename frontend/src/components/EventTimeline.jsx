import React from 'react';
import { Eye, MousePointer, ExternalLink } from 'lucide-react';

function EventTimeline({ events, loading, sessionId }) {
  // Format to HH:MM:SS
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getCleanUrl = (urlStr) => {
    try {
      const url = new URL(urlStr);
      return url.pathname + url.search;
    } catch (e) {
      return urlStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-sm">Loading user journey...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
        <div className="text-zinc-700 text-3xl mb-2">👤</div>
        <p className="text-sm font-medium">Select a session from the list to visualize the user journey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-200">User Journey Timeline</h4>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate max-w-[280px] sm:max-w-none">
            Session: {sessionId}
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <div className="relative border-l-2 border-zinc-800/80 ml-4 pl-6 space-y-6">
        {events.map((event, idx) => {
          const isClick = event.event_type === 'click';
          const time = formatTime(event.timestamp);

          return (
            <div key={event._id || idx} className="relative group">
              {/* Timeline dot/icon */}
              <div
                className={`absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-all duration-300 group-hover:scale-110 ${
                  isClick
                    ? 'bg-pink-950/80 border-pink-500/80 text-pink-400'
                    : 'bg-indigo-950/80 border-indigo-500/80 text-indigo-400'
                }`}
              >
                {isClick ? <MousePointer size={12} /> : <Eye size={12} />}
              </div>

              {/* Event card details */}
              <div className="glass-card p-4 hover:bg-zinc-900/40 relative">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isClick ? 'text-pink-400' : 'text-indigo-400'
                    }`}
                  >
                    {isClick ? 'Mouse Click' : 'Page View'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono font-medium">{time}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-300 font-mono break-all flex items-center gap-1.5">
                      <span className="text-zinc-600">URL:</span>
                      <span className="text-zinc-300 hover:text-indigo-400 transition-colors">
                        {getCleanUrl(event.page_url)}
                      </span>
                    </p>

                    {isClick && (
                      <div className="inline-flex items-center gap-1 text-xs font-mono text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                        <span>x: {event.x}</span>
                        <span className="text-pink-500/30">|</span>
                        <span>y: {event.y}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={event.page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                    title="Open URL in new tab"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventTimeline;
