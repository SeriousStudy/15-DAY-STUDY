
import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'pomodoro') {
          setTimeLeft((t) => (t <= 0 ? (setIsRunning(false), 0) : t - 1));
        } else {
          setSeconds(s => s + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, mode]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'pomodoro' ? (timeLeft / (25 * 60)) * 100 : 100;

  return (
    <div className={`apple-card p-10 flex flex-col items-center space-y-8`}>
      <div className={`flex rounded-full p-1 w-full border ${isDark ? 'bg-black/50 border-white/5' : 'bg-zinc-100 border-zinc-200'}`}>
        <button 
          onClick={() => { setMode('pomodoro'); setTimeLeft(25 * 60); setIsRunning(false); }}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${mode === 'pomodoro' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => { setMode('stopwatch'); setSeconds(0); setIsRunning(false); }}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${mode === 'stopwatch' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
        >
          Sprint
        </button>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" fill="transparent" className={`${isDark ? 'text-white/5' : 'text-zinc-100'}`} />
          <circle 
            cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" fill="transparent" 
            strokeDasharray={289} 
            strokeDashoffset={289 - (289 * progress) / 100} 
            strokeLinecap="round"
            className="text-blue-500 transition-all duration-1000 ease-linear" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-5xl font-extrabold tracking-tighter tabular-nums leading-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {mode === 'pomodoro' ? formatTime(timeLeft) : formatTime(seconds)}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-3 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {isRunning ? 'Processing' : 'Standby'}
          </span>
        </div>
      </div>

      <div className="flex space-x-3 w-full">
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-[2.5] py-5 rounded-full font-bold uppercase text-[11px] tracking-widest transition-all ${isRunning ? `${isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-200 text-zinc-700'} border` : 'bg-black text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 shadow-2xl'} hover-pop`}
        >
          {isRunning ? 'Hold' : 'Execute'}
        </button>
        <button 
          onClick={() => { setIsRunning(false); mode === 'pomodoro' ? setTimeLeft(25 * 60) : setSeconds(0); }}
          className={`w-16 rounded-full transition-all flex items-center justify-center border ${isDark ? 'bg-zinc-900 border-white/5 text-white hover:bg-zinc-800' : 'bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50'} hover-pop`}
        >
          ↺
        </button>
      </div>
    </div>
  );
};

export default Timer;
