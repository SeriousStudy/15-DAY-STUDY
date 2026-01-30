
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DayProgress, UserProgress, UserRank, VitalityStats } from './types';
import { generateDefaultSessions, RANKS, MOTIVATIONAL_QUOTES, START_DATE } from './constants';
import Dashboard from './components/Dashboard';
import DayDetails from './components/DayDetails';
import Header from './components/Header';
import Confetti from './components/Confetti';
import Login from './components/Login';
import SupportChat from './components/SupportChat';
import CasualChat from './components/CasualChat';
import LiveConsultant from './components/LiveConsultant';

const DEFAULT_VITALS: VitalityStats = {
  energy: 85,
  focus: 90,
  hydration: 0,
  sleep: 8
};

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('is_logged_in') === 'true');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentView, setCurrentView] = useState<{ type: 'dashboard' | 'day' | 'support' | 'live'; dayNum?: number; initialContext?: string }>({ type: 'dashboard' });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme_preference') === 'dark' || localStorage.getItem('theme_preference') === null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ROBUST KEY CHECK
  const isApiReady = useMemo(() => {
    try {
      return !!(typeof process !== 'undefined' && process.env && process.env.API_KEY);
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme_preference', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const storageKey = 'accountancy_bootcamp_2026';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      const initialDays: DayProgress[] = Array.from({ length: 15 }, (_, i) => {
        const d = new Date(START_DATE);
        d.setDate(START_DATE.getDate() + i);
        return {
          dayNumber: i + 1,
          dateString: d.toISOString(),
          sessions: generateDefaultSessions(i + 1, d),
          mistakes: "",
        };
      });
      const newProgress: UserProgress = {
        startDate: START_DATE.toISOString(),
        days: initialDays,
        points: 0,
        streak: 0,
        rank: UserRank.BEGINNER,
        lastVisitDate: new Date().toISOString(),
        vitals: DEFAULT_VITALS
      };
      setProgress(newProgress);
    }
  }, []);

  useEffect(() => {
    if (progress) localStorage.setItem('accountancy_bootcamp_2026', JSON.stringify(progress));
  }, [progress]);

  const updateVitals = useCallback((v: Partial<VitalityStats>) => {
    setProgress(p => p ? ({ ...p, vitals: { ...p.vitals, ...v } }) : null);
  }, []);

  const unlockedDay = useMemo(() => {
    const today = new Date();
    const start = new Date(START_DATE);
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diff, 0), 15);
  }, []);

  if (!isLoggedIn) return <Login onLogin={(p) => { setUserProfile(p); localStorage.setItem('user_profile', JSON.stringify(p)); localStorage.setItem('is_logged_in', 'true'); setIsLoggedIn(true); }} isDarkMode={isDarkMode} />;
  if (!progress) return null;

  // EMERGENCY DIAGNOSTIC SCREEN
  if (!isApiReady) {
    return (
      <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="max-w-xl w-full space-y-8 animate-pop">
           <div className="flex items-center space-x-6 mb-12">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">!</div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">System Offline</h2>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.4em]">Environmental Variable Failure</p>
              </div>
           </div>

           <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-[2.5rem] space-y-6">
              <p className="text-sm font-bold leading-relaxed opacity-70">
                Vercel cannot find your <span className="text-red-600 font-black">API_KEY</span>. To fix this, follow these steps exactly:
              </p>
              <ol className="space-y-4">
                 {[
                   { id: "1", t: "Go to your Vercel Project Dashboard" },
                   { id: "2", t: "Settings > Environment Variables" },
                   { id: "3", t: "Key: 'API_KEY' (Must be Caps)" },
                   { id: "4", t: "Value: Your Gemini API Key (AIza...)" },
                   { id: "5", t: "CRITICAL: Go to 'Deployments' and click REDEPLOY" }
                 ].map(s => (
                   <li key={s.id} className="flex items-center space-x-4">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">{s.id}</span>
                      <span className="text-xs font-bold uppercase tracking-tight">{s.t}</span>
                   </li>
                 ))}
              </ol>
           </div>

           <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => window.location.reload()} className="flex-1 py-6 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/30">
                Sync & Refresh
              </button>
              <button onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')} className="flex-1 py-6 border border-current rounded-full font-black text-xs uppercase tracking-widest">
                Get New Key
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isDarkMode ? 'bg-black text-white' : 'bg-[#fbfbfd] text-zinc-950'}`}>
      <Header 
        points={progress.points} 
        rank={progress.rank} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        resetProgress={() => { if(confirm("Purge all protocol data?")) { localStorage.clear(); window.location.reload(); } }}
        quote={MOTIVATIONAL_QUOTES[0]}
        userProfile={userProfile}
        onSearchClick={() => setSearchOpen(true)}
        onLiveClick={() => setCurrentView({ type: 'live' })}
        isApiReady={isApiReady}
      />
      
      <main className="w-full mx-auto relative">
        {currentView.type === 'dashboard' ? (
          <Dashboard progress={progress} unlockedDay={unlockedDay} onSelectDay={(n) => setCurrentView({ type: 'day', dayNum: n })} onOpenSupport={() => setCurrentView({ type: 'support' })} onUpdateVitals={updateVitals} />
        ) : currentView.type === 'day' ? (
          <DayDetails day={progress.days.find(d => d.dayNumber === currentView.dayNum)!} onBack={() => setCurrentView({ type: 'dashboard' })} onToggleTask={() => {}} onUpdateMistakes={() => {}} onAnalyzeMistakes={() => {}} onDayComplete={() => setShowCelebration(true)} />
        ) : currentView.type === 'live' ? (
          <LiveConsultant onBack={() => setCurrentView({ type: 'dashboard' })} />
        ) : (
          <SupportChat onBack={() => setCurrentView({ type: 'dashboard' })} initialMessage={currentView.initialContext} />
        )}
      </main>

      {searchOpen && (
        <div className="fixed inset-0 z-[200] backdrop-blur-xl bg-black/40 flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
           <div className={`w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-pop ${isDarkMode ? 'bg-zinc-950 border border-white/10' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <input autoFocus placeholder="Protocol Command (e.g. 'Day 5')..." className="w-full bg-transparent border-none outline-none text-4xl font-black placeholder:opacity-10" />
           </div>
        </div>
      )}

      <CasualChat />
      {showCelebration && <Confetti />}
    </div>
  );
};

export default App;
