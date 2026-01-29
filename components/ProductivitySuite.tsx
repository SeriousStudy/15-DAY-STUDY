
import React, { useState, useEffect, useMemo } from 'react';
import { EXAM_DATE } from '../constants';

const FORMULAS = [
  { name: 'Current Ratio', formula: 'Current Assets / Current Liabilities', result: 'Ideal: 2:1' },
  { name: 'Quick Ratio', formula: '(Current Assets - Inventory) / CL', result: 'Ideal: 1:1' },
  { name: 'Debt Equity', formula: 'Total Debt / Shareholders Funds', result: 'Solvency' },
  { name: 'Inventory T.O.', formula: 'COGS / Avg Inventory', result: 'Efficiency' },
  { name: 'G.P. Ratio', formula: '(G.P. / Net Sales) * 100', result: 'Profitability' },
];

const FLASHCARDS = [
  { q: "Double Entry?", a: "Every transaction affects two accounts equally (DR/CR)." },
  { q: "Accrual Concept?", a: "Record when earned/incurred, regardless of cash flow." },
  { q: "Going Concern?", a: "Business continues indefinitely." },
  { q: "Conservatism?", a: "Provide for losses, ignore anticipated profits." },
];

const ProductivitySuite: React.FC = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  const [waterCount, setWaterCount] = useState(0);
  const [notes, setNotes] = useState(() => localStorage.getItem('productivity_notes') || '');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [liveUsers] = useState(() => Math.floor(Math.random() * 900) + 100);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  const [formulaQuery, setFormulaQuery] = useState('');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [breathingState, setBreathingState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Relax'>('Relax');
  const [breathingTimer, setBreathingTimer] = useState(0);
  
  const [debits, setDebits] = useState<{id: number, val: number}[]>([]);
  const [credits, setCredits] = useState<{id: number, val: number}[]>([]);
  const [tInput, setTInput] = useState('');

  const [checkedChapters, setCheckedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('checked_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  const chapters = ["Partnership", "Share Capital", "Cash Flow", "Financial Analysis", "Ratios", "NPO"];

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffTime = EXAM_DATE.getTime() - now.getTime();
      const d = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setCountdown({ days: d, hours: h });
    };
    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('checked_chapters', JSON.stringify(checkedChapters));
  }, [checkedChapters]);

  useEffect(() => {
    let interval: any;
    if (breathingState !== 'Relax') {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev >= 4) {
            if (breathingState === 'Inhale') setBreathingState('Hold');
            else if (breathingState === 'Hold') setBreathingState('Exhale');
            else if (breathingState === 'Exhale') setBreathingState('Relax');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingState]);

  const filteredFormulas = useMemo(() => {
    if (!formulaQuery) return [];
    return FORMULAS.filter(f => f.name.toLowerCase().includes(formulaQuery.toLowerCase()));
  }, [formulaQuery]);

  const handleCalc = (val: string) => {
    if (val === '=') {
      try {
        const sanitized = calcInput.replace(/[^-+*/.0-9]/g, '');
        setCalcResult(eval(sanitized).toString());
      } catch { setCalcResult('Err'); }
    } else if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else { setCalcInput(prev => prev + val); }
  };

  const handleToggleChapter = (chapter: string) => {
    setCheckedChapters(prev => prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]);
  };

  const totalDebits = debits.reduce((acc, curr) => acc + curr.val, 0);
  const totalCredits = credits.reduce((acc, curr) => acc + curr.val, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* 1. Water */}
      <div className="apple-card p-5 sm:p-7 flex flex-col items-center justify-between min-h-[160px] hover-pop">
        <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hydration</h4>
        <div className="flex items-center space-x-5 my-2">
          <button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} className="w-8 h-8 rounded-full border border-black/5 dark:border-white/5 transition-colors">-</button>
          <span className="text-2xl sm:text-3xl font-black">{waterCount}</span>
          <button onClick={() => setWaterCount(waterCount + 1)} className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg">+</button>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, (waterCount / 8) * 100)}%` }} />
        </div>
      </div>

      {/* 2. Countdown */}
      <div className="apple-card p-5 sm:p-7 flex flex-col items-center justify-center min-h-[160px] hover-pop bg-red-600/5 border border-red-500/10">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-2">Finals T-Minus</h4>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-5xl font-black tracking-tighter text-red-500">{countdown.days}d</span>
          <span className="text-xl sm:text-2xl font-bold text-red-500/50">{countdown.hours}h</span>
        </div>
      </div>

      {/* 3. Flashcards */}
      <div className="apple-card p-5 sm:p-7 flex flex-col min-h-[160px] hover-pop relative">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Flash Recital</h4>
        <div 
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          className={`flex-1 flex items-center justify-center text-center p-2 cursor-pointer transition-all duration-300`}
        >
          <p className="text-[10px] sm:text-xs font-bold leading-tight">
            {flashcardFlipped ? FLASHCARDS[flashcardIdx].a : FLASHCARDS[flashcardIdx].q}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
           <button onClick={(e) => { e.stopPropagation(); setFlashcardIdx(i => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length); setFlashcardFlipped(false); }} className="text-[8px] font-bold text-blue-500">PREV</button>
           <button onClick={(e) => { e.stopPropagation(); setFlashcardIdx(i => (i + 1) % FLASHCARDS.length); setFlashcardFlipped(false); }} className="text-[8px] font-bold text-blue-500">NEXT</button>
        </div>
      </div>

      {/* 4. Curriculum */}
      <div className="apple-card p-5 sm:p-7 flex flex-col min-h-[160px] hover-pop">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Milestones</h4>
        <div className="space-y-1.5 overflow-y-auto hide-scrollbar max-h-[80px]">
          {chapters.map(ch => (
            <label key={ch} className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="hidden" checked={checkedChapters.includes(ch)} onChange={() => handleToggleChapter(ch)} />
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${checkedChapters.includes(ch) ? 'bg-green-500 border-green-500' : 'border-zinc-300'}`}>
                {checkedChapters.includes(ch) && <span className="text-white text-[7px]">✓</span>}
              </div>
              <span className={`text-[9px] font-bold ${checkedChapters.includes(ch) ? 'line-through opacity-30' : 'opacity-70'}`}>{ch}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. T-Account */}
      <div className="apple-card p-5 sm:p-7 flex flex-col min-h-[240px] lg:col-span-2 hover-pop">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Ledger Pad</h4>
          <div className="flex space-x-1.5">
            <button onClick={() => { if (tInput) setDebits([...debits, {id: Date.now(), val: parseFloat(tInput)}]); setTInput(''); }} className="text-[8px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded">DR+</button>
            <button onClick={() => { if (tInput) setCredits([...credits, {id: Date.now(), val: parseFloat(tInput)}]); setTInput(''); }} className="text-[8px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded">CR+</button>
          </div>
        </div>
        <input 
          type="number" value={tInput} onChange={(e) => setTInput(e.target.value)} placeholder="0.00"
          className={`w-full py-2 px-4 rounded-xl text-xs font-bold mb-3 outline-none border ${isDark ? 'bg-black border-white/5' : 'bg-zinc-50 border-black/5'}`}
        />
        <div className="flex-1 grid grid-cols-2 border-t border-black/5 dark:border-white/5 pt-2 gap-2">
          <div className="text-right border-r border-black/5 dark:border-white/5 pr-2">
            <div className="text-[8px] font-bold opacity-30 uppercase mb-1">Debit</div>
            <div className="space-y-0.5 text-[10px] font-mono opacity-60">
              {debits.map(d => <div key={d.id}>{d.val}</div>)}
            </div>
          </div>
          <div className="text-left pl-2">
            <div className="text-[8px] font-bold opacity-30 uppercase mb-1">Credit</div>
            <div className="space-y-0.5 text-[10px] font-mono opacity-60">
              {credits.map(c => <div key={c.id}>{c.val}</div>)}
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-[9px] font-black text-blue-600">Balance: {(totalDebits - totalCredits).toLocaleString()}</div>
      </div>

      {/* 6. Formula Vault */}
      <div className="apple-card p-5 sm:p-7 flex flex-col min-h-[240px] hover-pop lg:col-span-2">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Formula Query</h4>
        <input 
          type="text" value={formulaQuery} onChange={(e) => setFormulaQuery(e.target.value)}
          placeholder="e.g. Current Ratio" 
          className={`w-full py-3 px-5 rounded-xl border transition-all font-bold text-xs outline-none ${isDark ? 'bg-black border-white/5' : 'bg-zinc-50 border-black/5'}`}
        />
        <div className="mt-3 flex-1 overflow-y-auto hide-scrollbar space-y-2">
           {filteredFormulas.length > 0 ? filteredFormulas.map(f => (
             <div key={f.name} className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
               <p className="text-[9px] font-black text-blue-600 uppercase">{f.name}</p>
               <p className="text-[8px] font-mono mt-0.5 opacity-60">{f.formula}</p>
             </div>
           )) : (
             <div className="text-[9px] opacity-20 italic p-4 text-center">Query for financial logic...</div>
           )}
        </div>
      </div>

      {/* 7. Zen */}
      <div className="apple-card p-5 sm:p-7 flex flex-col items-center justify-between min-h-[200px] hover-pop">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Cognitive Calm</h4>
        <div className="relative w-16 h-16 flex items-center justify-center">
           <div className={`absolute w-full h-full rounded-full bg-blue-500/10 transition-all duration-1000 ${breathingState === 'Inhale' ? 'scale-125' : breathingState === 'Exhale' ? 'scale-75' : 'scale-100'}`}></div>
           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        </div>
        <div className="text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{breathingState}</p>
        </div>
        <button 
          onClick={() => setBreathingState(s => s === 'Relax' ? 'Inhale' : 'Relax')}
          className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-[9px] font-bold uppercase tracking-widest"
        >
          {breathingState === 'Relax' ? 'Protocol Start' : 'Halt'}
        </button>
      </div>

      {/* 8. Study Hall */}
      <div className="apple-card p-5 sm:p-7 flex flex-col justify-between min-h-[200px] hover-pop">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Study Hall</h4>
        <div className="flex items-center space-x-2 my-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold">{liveUsers} Live</span>
        </div>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest">Connect</button>
      </div>

      {/* 9. Calculator */}
      <div className="apple-card p-5 sm:p-7 flex flex-col min-h-[240px] lg:col-span-2 hover-pop">
        <div className="flex justify-between items-center mb-3">
           <h4 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Precision Engine</h4>
           <button onClick={() => handleCalc('C')} className="text-[8px] font-bold text-red-500">CLR</button>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl mb-3 text-right font-mono text-base h-12 flex flex-col justify-end">
          <div className="font-black truncate">{calcResult || calcInput || '0'}</div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 flex-1">
          {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
            <button 
               key={btn} 
               onClick={() => handleCalc(btn)} 
               className={`rounded-lg text-[10px] font-bold h-9 transition-all ${btn === '=' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-900'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* 10. Review */}
      <div className="apple-card p-5 sm:p-8 flex flex-col lg:col-span-2 min-h-[240px] hover-pop bg-blue-600/5 border border-blue-500/10">
        <h4 className="text-[9px] font-bold uppercase tracking-widest text-blue-600 mb-3">Daily Review</h4>
        <textarea 
           value={notes} onChange={(e) => setNotes(e.target.value)}
           placeholder="Record today's peak hour or critical insight..."
           className="flex-1 bg-transparent border-none outline-none text-xs font-bold italic leading-relaxed placeholder:opacity-20 resize-none"
        />
      </div>

    </div>
  );
};

export default ProductivitySuite;
