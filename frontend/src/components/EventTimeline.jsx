import React from 'react';
import { Eye, MousePointer, ExternalLink, ArrowUpDown, Monitor, Compass } from 'lucide-react';

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

  // Extract initial device metadata from the page_view event
  const pageViewEvent = events.find((e) => e.event_type === 'page_view' && e.metadata);
  const deviceMeta = pageViewEvent ? pageViewEvent.metadata : null;

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
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

      {/* Device Metadata Context Card */}
      {deviceMeta && (
        <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-3 text-xs space-y-2 font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Monitor size={12} className="text-indigo-400" />
            <span>
              Screen Size: <strong className="text-zinc-200">{deviceMeta.screen_width} × {deviceMeta.screen_height}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Compass size={12} className="text-pink-400" />
            <span className="truncate" title={deviceMeta.referrer}>
              Referrer: <strong className="text-zinc-200">{deviceMeta.referrer || 'Direct / None'}</strong>
            </span>
          </div>
          <div className="flex items-start gap-1.5 pt-2 border-t border-zinc-800/40 mt-1 text-[10px] text-zinc-500">
            <span className="font-semibold text-zinc-600">UA:</span>
            <span className="line-clamp-2 break-all" title={deviceMeta.user_agent}>
              {deviceMeta.user_agent}
            </span>
          </div>
        </div>
      )}

      {/* Timeline Event Cards */}
      <div className="relative border-l-2 border-zinc-800/80 ml-4 pl-6 space-y-6">
        {events.map((event, idx) => {
          const isClick = event.event_type === 'click';
          const isScroll = event.event_type === 'scroll_depth';
          const time = formatTime(event.timestamp);

          const getTimelineStyle = () => {
            if (isClick) return 'bg-pink-950/80 border-pink-500/80 text-pink-400';
            if (isScroll) return 'bg-amber-950/80 border-amber-500/80 text-amber-400';
            return 'bg-indigo-950/80 border-indigo-500/80 text-indigo-400';
          };

          const getTimelineIcon = () => {
            if (isClick) return <MousePointer size={12} />;
            if (isScroll) return <ArrowUpDown size={12} />;
            return <Eye size={12} />;
          };

          const getEventTitle = () => {
            if (isClick) return 'Mouse Click';
            if (isScroll) return 'Scroll Depth';
            return 'Page View';
          };

          const getEventTitleColor = () => {
            if (isClick) return 'text-pink-400';
            if (isScroll) return 'text-amber-400';
            return 'text-indigo-400';
          };

          return (
            <div key={event._id || idx} className="relative group">
              {/* Timeline dot/icon */}
              <div
                className={`absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-all duration-300 group-hover:scale-110 ${getTimelineStyle()}`}
              >
                {getTimelineIcon()}
              </div>

              {/* Event card details */}
              <div className="glass-card p-4 hover:bg-zinc-900/40 relative">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${getEventTitleColor()}`}>
                    {getEventTitle()}
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

                    {isScroll && (
                      <div className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        <span>Scrolled to {event.depth}%</span>
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
