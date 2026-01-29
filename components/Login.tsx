
import React from 'react';

interface LoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      <div className="max-w-md w-full animate-fade">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl font-bold italic">A</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">Welcome back.</h1>
          <p className="text-sm font-medium opacity-50">Log in to your 15-Day Bootcamp</p>
        </div>

        <div className={`apple-card p-10 flex flex-col items-center border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <p className="text-sm font-semibold mb-8 text-center">Could you log in with your Google account for saving information?</p>
          
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-zinc-200 rounded-full text-zinc-900 font-semibold hover:bg-zinc-50 transition-all hover:shadow-md group active:scale-95"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="mt-8 text-[10px] uppercase font-bold tracking-widest opacity-30 text-center">
            Your progress will be synced to our secure cloud vault.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[1em] opacity-10">Elite Challenge</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
