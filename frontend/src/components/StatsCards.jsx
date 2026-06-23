import React from 'react';
import { Users, Percent, BarChart3, ArrowDown } from 'lucide-react';

function StatsCards({ stats, loading }) {
  const cards = [
    {
      title: 'Total Sessions',
      value: loading ? '...' : stats.total_sessions || 0,
      description: 'Unique visitor sessions tracked',
      icon: <Users className="text-indigo-400" size={18} />,
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Bounce Rate',
      value: loading ? '...' : `${Math.round((stats.bounce_rate || 0) * 100)}%`,
      description: 'Single page-view sessions (no click/scroll)',
      icon: <Percent className="text-amber-500" size={18} />,
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Avg. Events / Session',
      value: loading ? '...' : stats.avg_events_per_session || 0,
      description: 'Mean event volume across visitors',
      icon: <BarChart3 className="text-pink-500" size={18} />,
      bgColor: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      title: 'Max Scroll Depth',
      value: loading ? '...' : `${stats.max_scroll_depth || 0}%`,
      description: 'Deepest scroll threshold crossed',
      icon: <ArrowDown className="text-emerald-400" size={18} />,
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={idx} 
          className="glass-panel p-5 border border-zinc-800 bg-zinc-950/20 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-500 font-mono font-semibold uppercase tracking-wider">
              {card.title}
            </span>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-xs text-zinc-500 mt-1 leading-normal">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
