
import React, { useMemo, useEffect } from 'react';
import { DayProgress } from '../types';

interface DayDetailsProps {
  day: DayProgress;
  onBack: () => void;
  onToggleTask: (dayNum: number, sessionId: string, taskId: string) => void;
  onUpdateMistakes: (dayNum: number, value: string) => void;
  onDayComplete: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ day, onBack, onToggleTask, onUpdateMistakes, onDayComplete }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const completedCount = useMemo(() => day.sessions.filter(s => s.completed).length, [day]);
  const progressPercent = (completedCount / day.sessions.length) * 100;

  useEffect(() => {
    if (completedCount === day.sessions.length) {
      onDayComplete();
    }
  }, [completedCount, day.sessions.length, onDayComplete]);

  return (
    <div className="space-y-10 animate-fade max-w-[1000px] mx-auto pb-32">
      <div className="flex items-center justify-between pt-8 px-4">
        <button 
          onClick={onBack}
          className={`flex items-center space-x-2 font-bold text-sm transition-all group ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'}`}
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Timeline</span>
        </button>
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-500">
          In Session
        </div>
      </div>

      <div className={`apple-card p-12 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h2 className={`text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Day {day.dayNumber} Session
            </h2>
            <p className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {new Date(day.dateString).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-4xl font-black text-blue-500">
                {Math.round(progressPercent)}%
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Daily Completion</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {day.sessions.map((session, sIndex) => (
          <div 
            key={session.id} 
            className={`apple-card p-10 transition-all duration-500 border-2 ${
              session.completed 
              ? `border-green-500/20 ${isDark ? 'bg-green-500/[0.02]' : 'bg-green-50/30'}` 
              : 'border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Session 0{sIndex + 1}</span>
                <h3 className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{session.title}</h3>
                <span className="text-[11px] font-medium text-blue-500 uppercase tracking-wider">{session.duration}</span>
              </div>
              {session.completed && (
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm shadow-lg">✓</div>
              )}
            </div>

            <div className="space-y-3">
              {session.tasks.map((task) => (
                <label 
                  key={task.id}
                  className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer group ${
                    task.completed 
                    ? `bg-transparent border-green-500/10 text-green-600/50` 
                    : `${isDark ? 'bg-zinc-900/50 border-white/5 hover:border-blue-500/30' : 'bg-zinc-50 border-zinc-100 hover:border-blue-500/20'}`
                  }`}
                >
                  <div className="mr-4">
                    <input 
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(day.dayNumber, session.id, task.id)}
                      className="hidden"
                    />
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      task.completed ? 'bg-blue-500 border-blue-500' : `${isDark ? 'bg-black border-white/10' : 'bg-white border-zinc-300'}`
                    }`}>
                      {task.completed && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${task.completed ? 'line-through opacity-30' : isDark ? 'text-white' : 'text-zinc-800'}`}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className={`apple-card p-10 mx-4 border border-zinc-200 dark:border-zinc-800`}>
        <div className="flex items-center space-x-4 mb-8">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'}`}>📓</div>
           <div>
             <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Mistakes</h3>
             <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Conceptual weakness</p>
           </div>
        </div>
        
        <textarea 
          placeholder="Record conceptual weaknesses or mistakes encountered..."
          value={day.mistakes}
          onChange={(e) => onUpdateMistakes(day.dayNumber, e.target.value)}
          className={`w-full h-48 rounded-2xl p-6 outline-none transition-all font-medium text-sm border-2 placeholder:opacity-30 resize-none ${isDark ? 'bg-black border-zinc-800 text-white focus:border-blue-500/50' : 'bg-zinc-50 border-zinc-100 text-zinc-900 focus:border-blue-500'}`}
        />
        <p className="mt-4 text-[9px] text-center font-bold uppercase tracking-[0.3em] text-zinc-400">Archived Locally</p>
      </section>

      <footer className="text-center py-24">
         <p className="text-[10px] font-bold uppercase tracking-[1em] opacity-20">Accountancy Challenge</p>
      </footer>
    </div>
  );
};

export default DayDetails;
