
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

declare global {
  interface Window {
    google: any;
  }
}

const DEFAULT_VITALS: VitalityStats = {
  energy: 85,
  focus: 90,
  hydration: 0,
  sleep: 8
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('is_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentView, setCurrentView] = useState<{ type: 'dashboard' | 'day' | 'support'; dayNum?: number }>({ type: 'dashboard' });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme_preference');
      return saved === 'dark';
    } catch {
      return true;
    }
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.className = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme_preference', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}, []);
  useEffect(() => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: "YOUR_CLIENT_ID",
      callback: () => {
        localStorage.setItem('is_logged_in', 'true');
        setIsLoggedIn(true);
      },
    });
  }
}, []);

  useEffect(() => {
    try {
      const storageKey = 'accountancy_bootcamp_2026';
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration for new Vitals feature
        if (!parsed.vitals) parsed.vitals = DEFAULT_VITALS;
        setProgress(parsed);
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
        localStorage.setItem(storageKey, JSON.stringify(newProgress));
      }
    } catch (e) {
      console.error("Bootcamp storage initialization failed:", e);
    }

    const interval = setInterval(() => {
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress) {
      localStorage.setItem('accountancy_bootcamp_2026', JSON.stringify(progress));
    }
  }, [progress]);

  const updateVitals = useCallback((newVitals: Partial<VitalityStats>) => {
    setProgress(prev => prev ? ({
      ...prev,
      vitals: { ...prev.vitals, ...newVitals }
    }) : null);
  }, []);

  const handleToggleTask = useCallback((dayNum: number, sessionId: string, taskId: string) => {
    setProgress(prev => {
      if (!prev) return null;
      const newDays = prev.days.map(d => {
        if (d.dayNumber !== dayNum) return d;
        const newSessions = d.sessions.map(s => {
          if (s.id !== sessionId) return s;
          const newTasks = s.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
          const allTasksDone = newTasks.every(t => t.completed);
          return { ...s, tasks: newTasks, completed: allTasksDone };
        });
        return { ...d, sessions: newSessions };
      });

      let totalPoints = 0;
      newDays.forEach(d => {
        d.sessions.forEach(s => {
          if (s.completed) totalPoints += 100;
          s.tasks.forEach(t => { if (t.completed) totalPoints += 25; });
        });
        if (d.mistakes.length > 5) totalPoints += 50;
      });

      const currentRank = RANKS.reduce((acc, r) => totalPoints >= r.threshold ? r.name : acc, UserRank.BEGINNER);
      return { ...prev, days: newDays, points: totalPoints, rank: currentRank };
    });
  }, []);

  const handleUpdateMistakes = useCallback((dayNum: number, value: string) => {
    setProgress(prev => {
      if (!prev) return null;
      return {
        ...prev,
        days: prev.days.map(d => d.dayNumber === dayNum ? { ...d, mistakes: value } : d)
      };
    });
  }, []);

  const unlockedDay = useMemo(() => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const startMidnight = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate()).getTime();
    
    if (todayMidnight < startMidnight) return 0;
    
    const diffTime = todayMidnight - startMidnight;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diffDays, 0), 15);
  }, []);

  const resetProgress = () => {
    if (window.confirm("Format entire bootcamp progress? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogin = () => {
  if (!window.google) {
    alert("Google SDK not loaded yet. Try again.");
    return;
  }

  window.google.accounts.id.prompt();
};


  window.google.accounts.id.initialize({
    client_id: "YOUR_CLIENT_ID_HERE",
    callback: (response: any) => {
      console.log("Login Success:", response);
      localStorage.setItem("is_logged_in", "true");
      setIsLoggedIn(true);
    },
  });

  window.google.accounts.id.prompt();
};

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  if (!progress) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-black">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Decrypting Protocol...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen transition-all bg-[#f5f5f7] dark:bg-black text-black dark:text-white">
      {currentView.type !== 'support' && (
        <Header 
          points={progress.points} 
          rank={progress.rank} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          resetProgress={resetProgress}
          quote={quote}
        />
      )}
      
      <main className="max-w-[1400px] mx-auto py-10 px-4">
        {currentView.type === 'dashboard' ? (
          <Dashboard 
            progress={progress} 
            unlockedDay={unlockedDay}
            onSelectDay={(num) => setCurrentView({ type: 'day', dayNum: num })} 
            onOpenSupport={() => setCurrentView({ type: 'support' })}
            onUpdateVitals={updateVitals}
          />
        ) : currentView.type === 'day' ? (
          <DayDetails 
            day={progress.days.find(d => d.dayNumber === currentView.dayNum)!} 
            onBack={() => setCurrentView({ type: 'dashboard' })} 
            onToggleTask={handleToggleTask}
            onUpdateMistakes={handleUpdateMistakes}
            onDayComplete={() => { setShowCelebration(true); setTimeout(() => setShowCelebration(false), 5000); }}
          />
        ) : (
          <SupportChat onBack={() => setCurrentView({ type: 'dashboard' })} />
        )}
      </main>

      {currentView.type !== 'support' && <CasualChat />}
      {showCelebration && <Confetti />}
    </div>
  );
};

export default App;
