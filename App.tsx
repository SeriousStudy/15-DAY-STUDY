
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

  // SAFE API KEY CHECK (Prevents crashes if process is undefined)
  const getApiKey = () => {
    try {
      return typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
    } catch {
      return undefined;
    }
  };
  const isApiReady = !!getApiKey();

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

  // DIAGNOSTIC OVERLAY
  if (!isApiReady) {
    return (
      <div className={`fixed inset-0 z-[500] flex flex-col items-center justify-center p-8 transition-colors ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="w-full max-w-2xl bg-red-600/5 border border-red-600/20 p-12 rounded-[3.5rem] shadow-2xl space-y-10 animate-pop">
           <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">!</div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Protocol: Connection Interrupted</h2>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Diagnostic System Active</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-red-600/10 border border-red-600/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">Error Log</p>
                 <p className="text-sm font-mono opacity-80">Variable [API_KEY] not found in client environment.</p>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Mandatory Resolution Steps</p>
                 <div className="grid gap-3">
                    {[
                      { step: "01", task: "Verify Vercel Variable Name is exactly 'API_KEY'" },
                      { step: "02", task: "Ensure the Value is your Gemini secret key (AIzaSy...)" },
                      { step: "03", task: "CRITICAL: Go to Deployments > Click latest > REDEPLOY" }
                    ].map(s => (
                      <div key={s.step} className="flex items-center space-x-4 p-4 rounded-xl border border-current opacity-60">
                         <span className="font-black text-xs">{s.step}</span>
                         <span className="font-bold text-xs uppercase tracking-tight">{s.task}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <button onClick={() => window.location.reload()} className="w-full py-6 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-600/30">
             Retry System Sync
           </button>
        </div>
        <p className="mt-10 text-[9px] font-black uppercase tracking-[0.5em] opacity-20">Elite Accountancy Protocol v3.0 Diagnostic Tool</p>
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
