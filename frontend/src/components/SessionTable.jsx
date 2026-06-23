import React from 'react';
import { Eye, MousePointer, Calendar, Clock } from 'lucide-react';

function SessionTable({ sessions, selectedSessionId, onSelectSession, loading }) {
  // Helper to format Date to relative or readable string
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Helper to get session duration
  const getDuration = (first, last) => {
    if (!first || !last) return '0s';
    const diffMs = new Date(last) - new Date(first);
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s`;
    const diffMin = Math.floor(diffSec / 60);
    const remSec = diffSec % 60;
    return `${diffMin}m ${remSec}s`;
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-sm">Loading sessions data...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass-panel p-8">
        <div className="text-zinc-600 text-4xl mb-3">📂</div>
        <h3 className="text-lg font-semibold text-zinc-300">No Sessions Found</h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1">
          Make sure your backend is running and you have clicked around on the <a href="http://localhost:4000/demo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">demo page</a> to generate events.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/30 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <th className="py-4 px-6">Session ID</th>
            <th className="py-4 px-4 text-center">Events</th>
            <th className="py-4 px-4 text-center">Bounced</th>
            <th className="py-4 px-4">Duration</th>
            <th className="py-4 px-4">Device / Resolution</th>
            <th className="py-4 px-4">Last Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900/50 text-sm">
          {sessions.map((session) => {
            const isSelected = session.session_id === selectedSessionId;
            return (
              <tr
                key={session.session_id}
                onClick={() => onSelectSession(session.session_id)}
                className={`cursor-pointer transition-all duration-200 hover:bg-zinc-800/30 ${
                  isSelected 
                    ? 'bg-indigo-600/10 text-white font-medium border-l-4 border-indigo-500' 
                    : session.bounced 
                      ? 'text-zinc-500 bg-zinc-950/10 opacity-70' 
                      : 'text-zinc-400'
                }`}
              >
                <td className="py-4 px-6 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-indigo-400' : session.bounced ? 'bg-amber-500/60' : 'bg-emerald-500'}`}></span>
                    <span className="truncate max-w-[120px] sm:max-w-none hover:text-indigo-400" title={session.session_id}>
                      {session.session_id.substring(0, 18)}...
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {session.event_count}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                    session.bounced 
                      ? 'bg-amber-500/10 text-amber-500/70 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {session.bounced ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-zinc-500" />
                    {getDuration(session.first_seen, session.last_seen)}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-mono text-zinc-500">
                  {session.device ? `${session.device.screen_width} × ${session.device.screen_height}` : 'N/A'}
                </td>
                <td className="py-4 px-4 text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Calendar size={12} />
                    {formatTime(session.last_seen)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SessionTable;
