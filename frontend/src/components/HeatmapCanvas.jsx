import React, { useState, useRef, useEffect } from 'react';
import { Eye, Layers, Settings, Maximize2, HelpCircle } from 'lucide-react';

function HeatmapCanvas({ clicks, loading, url }) {
  const [bgType, setBgType] = useState('wireframe'); // 'wireframe', 'grid', 'blank'
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [hoveredClick, setHoveredClick] = useState(null);

  // Responsive scaling to fit parent width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasWrapperRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const targetWidth = 1280;
        const newScale = Math.min(parentWidth / targetWidth, 1);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Trigger again after a small delay to ensure rendering completes
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [clicks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-sm font-medium">Fetching coordinates and generating heatmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-sm">
        <div className="space-y-0.5">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold font-mono">Heatmap Visualizer</span>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-zinc-200 truncate max-w-[280px] sm:max-w-md" title={url}>
              {url || 'No URL Selected'}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {clicks.length} {clicks.length === 1 ? 'click' : 'clicks'}
            </span>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBgType('wireframe')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              bgType === 'wireframe'
                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Layers size={13} />
            Wireframe Map
          </button>
          <button
            onClick={() => setBgType('grid')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              bgType === 'grid'
                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Settings size={13} />
            Mesh Grid
          </button>
          <button
            onClick={() => setBgType('blank')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              bgType === 'blank'
                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Maximize2 size={13} />
            Plain Canvas
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef} 
        className="w-full overflow-hidden relative rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl"
        style={{ height: `${1200 * scale}px` }}
      >
        <div
          ref={canvasWrapperRef}
          className="absolute origin-top-left w-[1280px] h-[1200px] select-none"
          style={{ transform: `scale(${scale})` }}
        >
          {/* BACKGROUND 1: WIREFRAME SCHEMATIC OF DEMO.HTML */}
          {bgType === 'wireframe' && (
            <div className="absolute inset-0 bg-[#060608] text-zinc-400 font-sans flex flex-col p-0">
              {/* Header Wireframe */}
              <div className="h-[60px] border-b border-zinc-800/60 px-8 flex justify-between items-center bg-zinc-900/20">
                <div className="font-extrabold text-sm tracking-wider text-zinc-600">ClickMap Logo</div>
                <div className="flex gap-6 text-xs text-zinc-700 font-medium">
                  <span>Features</span>
                  <span>Playground</span>
                  <span>Pricing</span>
                </div>
                <div className="h-7 w-20 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-600">
                  Sign In
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col justify-between py-6 px-16">
                {/* Hero section */}
                <div className="flex flex-col items-center justify-center text-center mt-6 space-y-4">
                  <div className="h-10 w-96 rounded-lg bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center text-xs text-zinc-600">
                    Hero Heading Area (Track User Behavior)
                  </div>
                  <div className="h-6 w-120 rounded-md bg-zinc-900/10 border border-zinc-900/40 flex items-center justify-center text-[10px] text-zinc-700">
                    Subtext description details
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-32 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400/70 font-semibold">
                      Get Started Free
                    </div>
                    <div className="h-8 w-32 rounded bg-zinc-900/50 border border-zinc-800/70 flex items-center justify-center text-[10px] text-zinc-500">
                      Book a Demo
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-6 my-4">
                  <div className="h-28 rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 flex flex-col justify-center space-y-2">
                    <div className="h-4 w-28 bg-zinc-800/60 rounded"></div>
                    <div className="h-3 w-full bg-zinc-900/40 rounded"></div>
                    <div className="h-3 w-4/5 bg-zinc-900/40 rounded"></div>
                  </div>
                  <div className="h-28 rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 flex flex-col justify-center space-y-2">
                    <div className="h-4 w-28 bg-zinc-800/60 rounded"></div>
                    <div className="h-3 w-full bg-zinc-900/40 rounded"></div>
                    <div className="h-3 w-4/5 bg-zinc-900/40 rounded"></div>
                  </div>
                  <div className="h-28 rounded-xl border border-zinc-900 bg-zinc-900/20 p-4 flex flex-col justify-center space-y-2">
                    <div className="h-4 w-28 bg-zinc-800/60 rounded"></div>
                    <div className="h-3 w-full bg-zinc-900/40 rounded"></div>
                    <div className="h-3 w-4/5 bg-zinc-900/40 rounded"></div>
                  </div>
                </div>

                {/* Interactive section */}
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex flex-col items-center space-y-3">
                  <div className="h-4 w-40 bg-zinc-800/50 rounded"></div>
                  <div className="h-6 w-56 rounded bg-pink-500/5 border border-pink-500/10 flex items-center justify-center text-[10px] text-pink-500/50">
                    Playground: Registered Clicks Counter
                  </div>
                  <div className="flex gap-4">
                    <div className="h-7 w-24 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500/50 flex items-center justify-center text-[9px]">Yellow Button</div>
                    <div className="h-7 w-24 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500/50 flex items-center justify-center text-[9px]">Green Button</div>
                    <div className="h-7 w-24 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500/50 flex items-center justify-center text-[9px]">Blue Button</div>
                    <div className="h-7 w-24 rounded bg-red-500/10 border border-red-500/20 text-red-500/50 flex items-center justify-center text-[9px]">Red Button</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-10 border-t border-zinc-900/60 flex items-center justify-center text-[9px] text-zinc-700 bg-zinc-900/10">
                &copy; 2026 ClickMap Inc. All rights reserved.
              </div>
            </div>
          )}

          {/* BACKGROUND 2: MESH GRID */}
          {bgType === 'grid' && (
            <div className="absolute inset-0 bg-[#09090b]" style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}>
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#09090b]/80 to-[#09090b]" />
            </div>
          )}

          {/* BACKGROUND 3: BLANK */}
          {bgType === 'blank' && (
            <div className="absolute inset-0 bg-[#0d0d11]" />
          )}

          {/* CLICKS LAYER */}
          <div className="absolute inset-0 pointer-events-none">
            {clicks.map((click, idx) => {
              const dotSize = 24;
              const left = click.x - dotSize / 2;
              const top = click.y - dotSize / 2;

              return (
                <div
                  key={idx}
                  className="absolute rounded-full bg-red-500/35 border border-red-400/40 pointer-events-auto cursor-pointer transition-all duration-200 hover:bg-red-400 hover:scale-150"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    boxShadow: '0 0 14px rgba(239, 68, 68, 0.8)',
                  }}
                  onMouseEnter={(e) => {
                    setHoveredClick({
                      ...click,
                      style: {
                        left: `${click.x}px`,
                        top: `${click.y - 15}px`,
                      }
                    });
                  }}
                  onMouseLeave={() => setHoveredClick(null)}
                />
              );
            })}
          </div>

          {/* Coordinate Hover Tooltip inside canvas wrapper */}
          {hoveredClick && (
            <div
              className="absolute pointer-events-none z-50 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 rounded px-2 py-1.5 shadow-xl flex flex-col gap-0.5 font-mono max-w-[200px]"
              style={{
                left: hoveredClick.style.left,
                top: hoveredClick.style.top,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-0.5 mb-0.5">
                <span className="font-bold text-red-400">Click Event</span>
                <span className="text-[8px] text-zinc-500">
                  {new Date(hoveredClick.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div>Position: <span className="text-white">({hoveredClick.x}, {hoveredClick.y})</span></div>
              <div className="truncate">Session: <span className="text-white">{hoveredClick.session_id.substring(0, 10)}...</span></div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {clicks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-zinc-950/80 backdrop-blur-sm">
            <div className="text-4xl mb-2">🔥</div>
            <h4 className="text-zinc-300 font-semibold">No Clicks Recorded</h4>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              There are no click interactions logged for this page. Open the <a href="http://localhost:4000/demo" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">demo page</a> and click on buttons to record interactions.
            </p>
          </div>
        )}
      </div>
      
      {/* Visual Indicator Info Box */}
      <div className="flex items-start gap-2.5 p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
        <HelpCircle size={15} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-zinc-400 leading-normal">
          <strong className="text-indigo-300">How to read:</strong> The red dots show precise client-side click locations. Because the dots are semi-transparent and use radial glow shadows, multiple overlapping clicks on the same button or area will stack, showing a brighter and more intense hot spot.
        </p>
      </div>
    </div>
  );
}

export default HeatmapCanvas;
