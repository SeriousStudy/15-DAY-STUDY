
import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

interface HeaderProps {
  points: number;
  rank: string;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  resetProgress: () => void;
  quote: string;
  userProfile?: { name: string; picture: string } | null;
  onSearchClick: () => void;
  onLiveClick: () => void;
  isApiReady?: boolean;
}

const Header: React.FC<HeaderProps> = ({ points, rank, isDarkMode, setIsDarkMode, resetProgress, quote, userProfile, onSearchClick, onLiveClick, isApiReady = true }) => {
  const [liveUsers, setLiveUsers] = useState(742);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.min(1000, Math.max(1, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 z-[100] w-full border-b transition-all duration-700 ${isDarkMode ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'} backdrop-blur-3xl`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:rotate-12 transition-transform">
             <span className="text-white font-black italic text-lg sm:text-xl">A</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight leading-none uppercase text-current">Elite Protocol</h1>
            <div className="flex items-center space-x-2 mt-1">
               <span className={`w-1.5 h-1.5 rounded-full ${isApiReady ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
               <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${isApiReady ? 'text-green-500' : 'text-red-500'}`}>
                 {isApiReady ? `${liveUsers} Live Now` : 'PROTOCOL OFFLINE'}
               </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-12 px-12 border-x border-black/5 dark:border-white/5 h-full">
           <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-current">Analytical XP</p>
              <p className="text-lg font-black tabular-nums text-blue-600 leading-none mt-1">{points}</p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-current">Current Rank</p>
              <p className="text-lg font-black uppercase tracking-tight text-current leading-none mt-1">{rank}</p>
           </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={onLiveClick}
            disabled={!isApiReady}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all shadow-lg group ${isApiReady ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' : 'bg-zinc-500/20 text-zinc-500 cursor-not-allowed grayscale'}`}
          >
            <span className={`w-2 h-2 rounded-full bg-white ${isApiReady ? 'animate-ping' : ''}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Live Audit</span>
          </button>
          
          <MusicPlayer />
          
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button 
              onClick={onSearchClick} 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}
              title="Search System"
            >
              🔍
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? '☼' : '☾'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
