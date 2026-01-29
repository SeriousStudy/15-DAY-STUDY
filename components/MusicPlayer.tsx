
import React, { useState, useRef, useEffect } from 'react';

type AudioType = {
  id: string;
  name: string;
  description: string;
  color: string;
};

const AUDIO_VARIETIES: AudioType[] = [
  { id: 'brown', name: 'Brown Noise', description: 'Deep Rumble', color: 'bg-amber-800' },
  { id: 'pink', name: 'Pink Noise', description: 'Soft Rainfall', color: 'bg-rose-400' },
  { id: 'white', name: 'White Noise', description: 'Steady Static', color: 'bg-zinc-300' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Tidal Rhythm', color: 'bg-blue-400' },
  { id: 'alpha', name: 'Alpha Focus', description: '10Hz Binaural', color: 'bg-indigo-500' },
  { id: 'theta', name: 'Theta Zen', description: '6Hz Meditation', color: 'bg-purple-500' },
  { id: 'drone', name: 'Study Drone', description: 'Deep Space', color: 'bg-slate-700' },
  { id: 'wind', name: 'Midnight Wind', description: 'Howling Gusts', color: 'bg-cyan-600' },
  { id: 'interstellar', name: 'Interstellar', description: 'Organ & Space', color: 'bg-blue-900' },
  { id: 'oppenheimer', name: 'Oppenheimer', description: 'Atomic Tension', color: 'bg-orange-900' },
  { id: 'pulse', name: 'Minimalist Pulse', description: 'Steady Rhythm', color: 'bg-emerald-500' },
  { id: 'library', name: 'Library Hiss', description: 'Cozy Ambiance', color: 'bg-orange-300' },
];

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState('brown');
  const [showMenu, setShowMenu] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<ScriptProcessorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const selectedVariety = AUDIO_VARIETIES.find(v => v.id === selectedId) || AUDIO_VARIETIES[0];

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = (typeId: string) => {
    stopAudio();

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = 4096;
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.5;
    
    let lastOut = 0.0; // For brown/pink filtering
    let phase = 0; // For oscillators
    let b0, b1, b2, b3, b4, b5, b6; // For pink noise
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    const node = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        let sample = 0;
        const white = Math.random() * 2 - 1;

        // Synthesis Logic
        switch (typeId) {
          case 'brown':
            sample = (lastOut + (0.02 * white)) / 1.02;
            lastOut = sample;
            sample *= 5.5; 
            break;
          case 'pink':
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            sample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            sample *= 0.11; 
            b6 = white * 0.115926;
            break;
          case 'white':
            sample = white * 0.2;
            break;
          case 'alpha': 
            phase += 440 / audioCtx.sampleRate;
            sample = Math.sin(phase * 2 * Math.PI) * 0.1;
            sample += Math.sin((phase * 2 * Math.PI) * 1.02) * 0.1; 
            break;
          case 'theta': 
            phase += 220 / audioCtx.sampleRate;
            sample = Math.sin(phase * 2 * Math.PI) * 0.15;
            sample += Math.sin((phase * 2 * Math.PI) * 1.01) * 0.15;
            break;
          case 'ocean':
            const lfo = Math.sin(2 * Math.PI * (audioCtx.currentTime / 8)) * 0.5 + 0.5;
            sample = white * lfo * 0.3;
            break;
          case 'drone':
            phase += 60 / audioCtx.sampleRate;
            sample = Math.sin(phase * 2 * Math.PI) * 0.3;
            sample += (Math.random() * 2 - 1) * 0.05; 
            break;
          case 'wind':
            const windLfo = Math.sin(2 * Math.PI * (audioCtx.currentTime / 12)) * 0.3 + 0.7;
            sample = (lastOut + (0.01 * white)) / 1.01;
            lastOut = sample;
            sample *= windLfo * 6;
            break;
          case 'interstellar':
            const organFreq = 65.41; 
            phase += organFreq / audioCtx.sampleRate;
            const pulseLfo = Math.pow(Math.sin(2 * Math.PI * (audioCtx.currentTime * 1.25)), 8);
            sample = Math.sin(phase * 2 * Math.PI) * 0.2; 
            sample += Math.sin(phase * 4 * Math.PI) * 0.1; 
            sample += Math.sin(phase * 3 * Math.PI) * 0.05; 
            sample *= (0.6 + pulseLfo * 0.4);
            sample += white * 0.01; 
            break;
          case 'oppenheimer':
            const tick = Math.pow(Math.sin(2 * Math.PI * (audioCtx.currentTime * 3)), 64);
            const tensionSwell = Math.sin(2 * Math.PI * (audioCtx.currentTime * 0.1)) * 0.5 + 0.5;
            const violinFreq = 440 + Math.sin(audioCtx.currentTime * 5) * 5; 
            phase += violinFreq / audioCtx.sampleRate;
            sample = Math.sin(phase * 2 * Math.PI) * 0.1 * tensionSwell;
            sample += tick * 0.1; 
            sample += (Math.random() * 2 - 1) * 0.02 * tensionSwell; 
            break;
          case 'pulse':
            const pulse = Math.sin(2 * Math.PI * (audioCtx.currentTime * 2)) > 0.9 ? 1 : 0;
            phase += 330 / audioCtx.sampleRate;
            sample = Math.sin(phase * 2 * Math.PI) * pulse * 0.2;
            break;
          case 'library':
            sample = white * 0.02; 
            break;
          default:
            sample = white * 0.1;
        }

        // --- THE BEAT ---
        // Add a rhythmic 120 BPM kick pulse to enhance concentration
        const beatInterval = 0.5; // 0.5s = 120 BPM
        const currentBeatTime = audioCtx.currentTime % beatInterval;
        const kickDecay = Math.exp(-currentBeatTime * 15); // Fast exponential decay
        const kickFreq = 50 * Math.exp(-currentBeatTime * 10); // Pitch slide down
        const kickOsc = Math.sin(2 * Math.PI * kickFreq * currentBeatTime);
        const kickSample = kickOsc * kickDecay * 0.4;
        
        // Mix the kick beat into the existing sample
        sample += kickSample;

        output[i] = sample;
      }
    };

    node.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    audioContextRef.current = audioCtx;
    sourceNodeRef.current = node;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const handleToggle = () => {
    if (isPlaying) stopAudio();
    else startAudio(selectedId);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isPlaying) startAudio(id);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    if (showMenu) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showMenu]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center bg-black/40 border border-white/10 rounded-full pl-1 pr-4 py-1 hover:border-indigo-500/50 transition-all shadow-xl backdrop-blur-md">
        <button 
          onClick={handleToggle}
          className="flex items-center group pr-3"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/5 group-hover:bg-white/10'}`}>
            {isPlaying ? (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-3 bg-white animate-bounce"></div>
                <div className="w-1 h-4 bg-white animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-2 bg-white animate-bounce [animation-delay:0.4s]"></div>
              </div>
            ) : (
              <span className="text-xs text-white translate-x-0.5">▶</span>
            )}
          </div>
          <div className="text-left ml-3">
            <p className="text-[9px] font-black uppercase tracking-tighter text-white/50 leading-none">Focus Audio</p>
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">{selectedVariety.name}</p>
          </div>
        </button>

        <button 
          onClick={() => setShowMenu(!showMenu)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showMenu ? 'bg-indigo-500 text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}
        >
          <span className="text-lg">▾</span>
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-zinc-900/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl z-[100] animate-pop origin-top-right">
          <div className="p-4 border-b border-white/5 bg-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Select Protocol Audio</p>
          </div>
          <div className="max-h-80 overflow-y-auto py-2 hide-scrollbar">
            {AUDIO_VARIETIES.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelect(v.id)}
                className={`w-full flex items-center px-4 py-3 transition-all hover:bg-white/5 ${selectedId === v.id ? 'bg-white/10' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg ${v.color} flex items-center justify-center shadow-lg`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                </div>
                <div className="text-left ml-4 flex-1">
                  <p className="text-xs font-bold text-white tracking-tight">{v.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{v.description}</p>
                </div>
                {selectedId === v.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-white/5 text-center">
             <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Beat Synchronization Enabled</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
