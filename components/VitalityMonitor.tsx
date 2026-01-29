
import React from 'react';
import { VitalityStats } from '../types';

interface VitalityMonitorProps {
  vitals: VitalityStats;
  onUpdate: (v: Partial<VitalityStats>) => void;
}

const VitalityMonitor: React.FC<VitalityMonitorProps> = ({ vitals, onUpdate }) => {
  const isDark = document.documentElement.classList.contains('dark');

  const updateMetric = (key: keyof VitalityStats, val: number) => {
    onUpdate({ [key]: Math.min(100, Math.max(0, val)) });
  };

  return (
    <div className="apple-card p-6 sm:p-8 flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Ready Protocol</h3>
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {/* Energy */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Energy Level</span>
            <span className="text-[10px] font-bold text-blue-500">{vitals.energy}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-700" 
              style={{ width: `${vitals.energy}%` }} 
            />
          </div>
        </div>

        {/* Focus */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Focus Depth</span>
            <span className="text-[10px] font-bold text-blue-500">{vitals.focus}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700" 
              style={{ width: `${vitals.focus}%` }} 
            />
          </div>
        </div>

        {/* Quick Vitals Adjusters */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button 
            onClick={() => updateMetric('energy', vitals.energy + 10)}
            className={`py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest border transition-all ${isDark ? 'bg-zinc-900 border-white/5 hover:bg-zinc-800' : 'bg-zinc-50 border-black/5 hover:bg-white'}`}
          >
            Refuel
          </button>
          <button 
            onClick={() => updateMetric('focus', vitals.focus + 10)}
            className={`py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest border transition-all ${isDark ? 'bg-zinc-900 border-white/5 hover:bg-zinc-800' : 'bg-zinc-50 border-black/5 hover:bg-white'}`}
          >
            Deep Study
          </button>
        </div>
      </div>

      <p className="text-[8px] font-medium opacity-30 italic text-center uppercase tracking-widest">
        Vitals impact AI Coach suggestions
      </p>
    </div>
  );
};

export default VitalityMonitor;
