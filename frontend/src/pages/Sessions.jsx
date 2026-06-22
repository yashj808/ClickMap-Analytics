import React, { useState, useEffect, useRef } from 'react';
import SessionTable from '../components/SessionTable';
import EventTimeline from '../components/EventTimeline';
import { Users, RefreshCw, Radio } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);

  // Fetch all sessions
  const fetchSessions = async (showSilentLoading = false) => {
    if (!showSilentLoading) setLoadingSessions(true);
    try {
      const response = await fetch(`${API_BASE}/api/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        console.error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fetch events for a single session
  const fetchSessionEvents = async (sessionId) => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${API_BASE}/api/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionEvents(data);
      } else {
        console.error('Failed to fetch session events');
      }
    } catch (error) {
      console.error('Error fetching session events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Initial fetch and polling setup
  useEffect(() => {
    fetchSessions();

    // Setup 10-second polling
    const pollInterval = setInterval(() => {
      fetchSessions(true); // silent refresh (don't show big loader)
      setCountdown(10);
    }, 10000);

    // Countdown tick
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 10;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timerRef.current);
    };
  }, []);

  // Fetch events when selected session changes
  useEffect(() => {
    if (selectedSessionId) {
      fetchSessionEvents(selectedSessionId);
    } else {
      setSessionEvents([]);
    }
  }, [selectedSessionId]);

  const handleManualRefresh = () => {
    fetchSessions();
    setCountdown(10);
    if (selectedSessionId) {
      fetchSessionEvents(selectedSessionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="text-indigo-400" size={24} />
            User Sessions
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze user footprints, active sessions, and behavioral clickstreams.
          </p>
        </div>

        {/* Polling / Manual Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 px-3 py-2 rounded-lg font-mono">
            <Radio size={12} className="animate-pulse" />
            <span>Polling in {countdown}s</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw size={13} className={loadingSessions ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Grid Layout: Sessions on left, Timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Sessions Table */}
        <div className="lg:col-span-2 space-y-4">
          <SessionTable
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
            loading={loadingSessions}
          />
        </div>

        {/* Right Side: Selected Session Timeline */}
        <div className="lg:col-span-1 glass-panel p-6 border border-zinc-800/80 bg-zinc-950/20">
          <EventTimeline
            events={sessionEvents}
            loading={loadingEvents}
            sessionId={selectedSessionId}
          />
        </div>
      </div>
    </div>
  );
}

export default Sessions;
