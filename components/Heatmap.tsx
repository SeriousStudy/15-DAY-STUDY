
import React from 'react';
import { DayProgress } from '../types';

interface HeatmapProps {
  days: DayProgress[];
  unlockedDay: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ days, unlockedDay }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className={`apple-card p-10 flex flex-col`}>
      <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-10 text-zinc-400`}>Momentum</h3>
      <div className="grid grid-cols-5 gap-3">
        {days.map((day) => {
          const completed = day.sessions.filter(s => s.completed).length;
          const isLocked = day.dayNumber > unlockedDay;
          
          let intensityClass = isDark ? 'bg-white/5' : 'bg-zinc-100';
          if (!isLocked) {
            if (completed === 1) intensityClass = 'bg-blue-100 dark:bg-blue-900/30';
            if (completed === 2) intensityClass = 'bg-blue-300 dark:bg-blue-700/50';
            if (completed === 3) intensityClass = 'bg-blue-500 shadow-sm';
            if (completed === 4) intensityClass = isDark ? 'bg-white shadow-lg' : 'bg-blue-700 shadow-md';
          }

          return (
            <div 
              key={day.dayNumber}
              title={`Protocol ${day.dayNumber}: ${completed}/4 Efficiency`}
              className={`aspect-square rounded-lg transition-all ${intensityClass} ${isLocked ? 'opacity-20' : 'hover:scale-110 cursor-help'}`}
            >
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-10 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-400">
        <span>Variance</span>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-blue-300 dark:bg-blue-700/50 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
          <div className={`w-2.5 h-2.5 rounded-sm ${isDark ? 'bg-white' : 'bg-blue-700'}`}></div>
        </div>
        <span>Peak</span>
      </div>
    </div>
  );
};

export default Heatmap;
