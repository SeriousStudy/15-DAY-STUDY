
import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

interface HeaderProps {
  points: number;
  rank: string;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  resetProgress: () => void;
  quote: string;
}

const Header: React.FC<HeaderProps> = ({ points, rank, isDarkMode, setIsDarkMode, resetProgress, quote }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <header className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-black/80 border-white/10' : 'bg-[#f5f5f7]/80 border-black/5'} backdrop-blur-xl border-b`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black italic text-sm sm:text-base">PP</span>
          </div>
          <div className="block">
            <h1 className={`text-sm sm:text-lg font-bold tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
              Bootcamp
            </h1>
            <p className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5 sm:mt-1">Elite 2026</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center flex-1 mx-4">
          <div className={`text-sm font-black tracking-widest tabular-nums ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {formattedTime}
          </div>
          <p className={`text-[9px] font-bold uppercase tracking-[0.3em] mt-1 line-clamp-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {quote}
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block">
            <MusicPlayer />
          </div>
          
          <div className="flex flex-col items-end mr-1 sm:mr-2">
            <span className={`text-[10px] sm:text-sm font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{points} XP</span>
            <span className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{rank}</span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover-pop text-xs sm:text-base ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isDarkMode ? '☼' : '☾'}
            </button>

            <button 
              onClick={resetProgress}
              className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-4 h-8 sm:h-10 rounded-full transition-all ${isDarkMode ? 'text-zinc-600 border border-white/10 hover:bg-red-500 hover:text-white' : 'text-zinc-400 border border-black/5 hover:bg-red-500 hover:text-white'}`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
