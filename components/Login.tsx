import React from "react";

interface LoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
      }`}
    >
      <div className="max-w-md w-full animate-fade">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl font-bold italic">A</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">
            Welcome back.
          </h1>
          <p className="text-sm font-medium opacity-50">
            Log in to your 15-Day Bootcamp
          </p>
        </div>

        <div
          className={`apple-card p-10 flex flex-col items-center border ${
            isDarkMode ? "border-white/5" : "border-black/5"
          }`}
        >
          <p className="text-sm font-semibold mb-8 text-center">
            Could you log in with your Google account for saving information?
          </p>

          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border border-zinc-200 rounded-full text-zinc-900 font-semibold hover:bg-zinc-50 transition-all hover:shadow-md active:scale-95"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.22 3.31v2.75h3.6c2.11-1.94 3.26-4.8 3.26-8.07z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.6-2.75c-.99.66-2.26 1.06-3.68 1.06-2.83 0-5.23-1.91-6.09-4.48H2.2v2.81C4.02 20.98 7.73 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.91 14.17A6.5 6.5 0 015.56 12c0-.75.13-1.48.35-2.17V7.02H2.2A10.99 10.99 0 001 12c0 1.77.43 3.44 1.2 4.98l3.71-2.81z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.36c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.73 1 4.02 3.02 2.2 6.02l3.71 2.81C6.77 7.27 9.17 5.36 12 5.36z"
                fill="#EA4335"
              />
            </svg>

            <span>Sign in with Google</span>
          </button>

          <p className="mt-8 text-[10px] uppercase font-bold tracking-widest opacity-30 text-center">
            Your progress will be synced to our secure cloud vault.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[1em] opacity-10">
            Elite Challenge
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
