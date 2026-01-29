
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#0071e3', '#32d74b', '#ff9f0a', '#ff453a', '#bf5af2'];
    const newParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      duration: Math.random() * 1.5 + 1.5,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade duration-1000 pointer-events-none px-4">
         <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl px-12 py-8 rounded-[2rem] shadow-2xl border border-white/20 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">Well Done.</h2>
            <p className="text-sm font-semibold text-blue-500 mt-2 uppercase tracking-widest">Protocol Completed</p>
         </div>
      </div>
    </div>
  );
};

export default Confetti;
