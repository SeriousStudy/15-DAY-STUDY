
import React, { useMemo, useState } from 'react';
import { UserProgress, VitalityStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Heatmap from './Heatmap';
import Timer from './Timer';
import ProductivitySuite from './ProductivitySuite';
import VitalityMonitor from './VitalityMonitor';

interface DashboardProps {
  progress: UserProgress;
  unlockedDay: number;
  onSelectDay: (day: number) => void;
  onOpenSupport: () => void;
  onUpdateVitals: (v: Partial<VitalityStats>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, unlockedDay, onSelectDay, onOpenSupport, onUpdateVitals }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [showTools, setShowTools] = useState(false);
  
  const chartData = useMemo(() => {
    let runningTotal = 0;
    return progress.days.slice(0, 15).map(d => {
      const completed = d.sessions.filter(s => s.completed).length;
      runningTotal += (completed * 25);
      return {
        day: `D${d.dayNumber}`,
        points: runningTotal,
      };
    });
  }, [progress, unlockedDay]);

  const stats = useMemo(() => {
    const totalSessions = 15 * 4;
    const completed = progress.days.reduce((acc, d) => acc + d.sessions.filter(s => s.completed).length, 0);
    return {
      completed,
      total: totalSessions,
      percent: Math.round((completed / totalSessions) * 100),
    };
  }, [progress]);

  return (
    <div className="space-y-10 sm:space-y-16 animate-fade max-w-[1200px] mx-auto px-4 pb-40">
      {/* Featured Header Card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-8">
        <div className={`lg:col-span-2 p-8 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col justify-between apple-card relative overflow-hidden animate-pop`}>
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Intensive Training</p>
            <h2 className={`text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight sm:leading-[1.1] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Master Accountancy <br className="hidden sm:block"/>
              <span className="opacity-40 italic">In 15 Days.</span>
            </h2>

            <div className="flex items-center space-x-8 sm:space-x-12 pt-2 sm:pt-4">
               <div className="animate-fade" style={{animationDelay: '0.2s'}}>
                 <p className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Progress</p>
                 <p className="text-2xl sm:text-4xl font-black">{stats.percent}%</p>
               </div>
               <div className="animate-fade" style={{animationDelay: '0.3s'}}>
                 <p className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>XP Gained</p>
                 <p className="text-2xl sm:text-4xl font-black text-blue-500">{progress.points}</p>
               </div>
            </div>

            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5">
                <button 
                  onClick={() => onSelectDay(Math.max(1, unlockedDay))}
                  className="px-8 sm:px-12 py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-xl hover:shadow-blue-500/30 active:scale-95 hover-pop"
                >
                  {unlockedDay === 0 ? 'View Plan' : `Day ${unlockedDay} Access`}
                </button>
                <button 
                  onClick={onOpenSupport}
                  className={`px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-xs sm:text-sm transition-all border ${isDark ? 'bg-zinc-900 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'} hover-pop`}
                >
                  AI Coach
                </button>
                <button 
                  onClick={() => setShowTools(!showTools)}
                  className={`px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-xs sm:text-sm transition-all border ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 hover:bg-zinc-50 text-black shadow-sm'} hover-pop`}
                >
                  {showTools ? 'Hide Suite' : 'Suite 15'}
                </button>
            </div>
          </div>
          
          <div className="absolute right-[-5%] bottom-[-5%] text-[12rem] sm:text-[24rem] font-black opacity-[0.03] pointer-events-none select-none">
            {unlockedDay || '0'}
          </div>
        </div>

        <div className="space-y-8 animate-pop" style={{animationDelay: '0.1s'}}>
          <VitalityMonitor vitals={progress.vitals} onUpdate={onUpdateVitals} />
        </div>
      </section>

      {/* Productivity Tools Section */}
      {showTools && (
        <section className="space-y-6 sm:space-y-8 animate-fade">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Performance Engine</h3>
              <p className="text-[10px] sm:text-xs font-medium text-zinc-400 mt-1">Specialized Accounting Tools</p>
            </div>
          </div>
          <ProductivitySuite />
        </section>
      )}

      {/* Analytics & Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className={`lg:col-span-2 p-6 sm:p-10 apple-card animate-fade`} style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h3 className={`text-[10px] sm:text-sm font-bold tracking-tight uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Growth Projection</h3>
          </div>
          <div className="h-48 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    background: isDark ? '#1c1c1e' : '#fff', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '10px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#0071e3" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPoints)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="animate-fade" style={{animationDelay: '0.5s'}}>
          <Timer />
        </div>
      </section>

      {/* Timeline Grid */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2">
          <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Curriculum Timeline</h3>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Deploy: Feb 1 – Feb 15</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {progress.days.map((day, idx) => {
            const isLocked = day.dayNumber > unlockedDay;
            const completedCount = day.sessions.filter(s => s.completed).length;
            const isToday = day.dayNumber === unlockedDay;

            return (
              <button
                key={day.dayNumber}
                disabled={isLocked}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] text-left transition-all duration-500 group animate-fade hover-pop ${
                  isLocked 
                  ? 'bg-zinc-100 dark:bg-zinc-900/50 opacity-30 cursor-not-allowed border border-transparent' 
                  : isToday 
                    ? 'apple-card ring-2 sm:ring-4 ring-blue-500/20 border-2 border-blue-500/10 shadow-xl scale-[1.02] sm:scale-[1.03]' 
                    : 'apple-card border border-black/[0.03] dark:border-white/[0.03] hover:-translate-y-1 sm:hover:-translate-y-2'
                }`}
                style={{animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex flex-col h-full justify-between space-y-4 sm:space-y-8">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] sm:text-[10px] font-black tracking-widest uppercase opacity-40`}>D{day.dayNumber < 10 ? '0' : ''}{day.dayNumber}</span>
                    <span className="text-sm sm:text-lg">{isLocked ? '🔒' : completedCount === 4 ? '✅' : '🕒'}</span>
                  </div>
                  <div className={`text-xl sm:text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {new Date(day.dateString).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                {!isLocked && (
                   <div className="absolute bottom-3 sm:bottom-6 left-5 sm:left-8 right-5 sm:right-8 h-1 sm:h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${(completedCount / 4) * 100}%` }} />
                   </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* About Me Section */}
      <section className="pt-10 sm:pt-20 border-t border-black/[0.05] dark:border-white/[0.05] animate-fade">
        <div className="apple-card p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900 border border-zinc-200 dark:border-white/5">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            <div className="flex flex-col items-center lg:items-start space-y-6 sm:space-y-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-2xl relative overflow-hidden group">
                  <span className="relative z-10 group-hover:scale-110 transition-transform">PP</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Piyush Pandey</h3>
                  <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1">Creator & Architect</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h4 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>Founder's Vision</h4>
                <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto lg:mx-0"></div>
              </div>
              
              <p className={`text-sm sm:text-lg leading-relaxed font-medium text-center lg:text-left ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                This platform was conceived by **Piyush Pandey**, a dedicated Accountancy student who realized that mastering complex financial logic requires more than just textbooks—it requires a disciplined, high-performance protocol. 
                <br/><br/>
                Having experienced the pressures of accounting examinations firsthand, Piyush Pandey designed this 15-day bootcamp to bridge the gap between rigorous conceptual clarity and surgical execution. 
              </p>
              
              <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <div className="flex -space-x-2 sm:space-x-[-0.75rem]">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden shadow-lg">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" />
                     </div>
                   ))}
                </div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest opacity-40 text-center">Trusted by 500+ aspirants</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="text-center py-10 sm:py-20">
         <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mx-auto mb-4 sm:mb-6"></div>
         <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.5em] sm:tracking-[1em] opacity-20">Elite Bootcamp Protocol</p>
         <p className="text-[7px] sm:text-[9px] font-medium opacity-10 mt-2 sm:mt-4">Handcrafted by Piyush Pandey</p>
      </footer>
    </div>
  );
};

export default Dashboard;
