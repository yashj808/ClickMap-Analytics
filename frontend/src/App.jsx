import React, { useState } from 'react';
import Sessions from './pages/Sessions';
import Heatmap from './pages/Heatmap';
import { Users, Flame, ExternalLink, LineChart } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'heatmap'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <LineChart size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">ClickMap</h1>
              <span className="text-[10px] text-zinc-500 font-mono font-semibold">USER ANALYTICS</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'sessions'
                  ? 'bg-zinc-800/50 text-indigo-400 border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Users size={15} />
              <span className="hidden sm:inline">Sessions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'heatmap'
                  ? 'bg-zinc-800/50 text-pink-400 border border-zinc-700/50'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Flame size={15} />
              <span className="hidden sm:inline">Heatmap</span>
            </button>
          </nav>

          {/* External Links */}
          <div className="flex items-center">
            <a
              href="http://localhost:4000/demo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all duration-200"
            >
              <span>Open Demo Site</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="transition-all duration-300">
          {activeTab === 'sessions' ? <Sessions /> : <Heatmap />}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs text-zinc-600 relative z-10">
        <p>&copy; 2026 ClickMap Analytics Dashboard. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
