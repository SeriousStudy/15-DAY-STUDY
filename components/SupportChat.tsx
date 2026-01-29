
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { askAI } from "../ai";

const FAQS = [
  { q: "Goodwill formula?", a: "Goodwill = Average Profit × No. of years' purchase." },
  { q: "Partnership rules?", a: "Profit shared equal if no deed. No salary, no IOC. Loan int. @ 6% p.a." },
  { q: "Sacrificing Ratio?", a: "Sacrificing Ratio = Old Ratio - New Ratio." },
];

// Audio Encoding/Decoding Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SupportChat: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: "Elite Accountancy Coach active. Would you like to switch to Live Voice Mode for real-time tutoring?" }
  ]);
  
  // Live Voice States
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stopLiveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsLiveMode(false);
    setIsConnecting(false);
  }, []);

  const startLiveSession = async () => {
    if (isLiveMode) {
      stopLiveSession();
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveMode(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioCtxRef.current?.output;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const buffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(outCtx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopLiveSession(),
          onerror: () => stopLiveSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are the Elite Accountancy Coach. You are helping a student in a 15-day bootcamp. You are professional, encouraging, and precise.",
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping || isLiveMode) return;
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: "AIzaSyCPKK4YBQNyJJVB_eidndVU5Bn1CgQlXHE" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: { systemInstruction: "You are the Elite Accountancy Coach. Precise and concise." },
      });
      setMessages(prev => [
  ...prev,
  {
    type: 'bot',
    text: response?.text || "I'm thinking… ask again."
  }
]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "Coach offline. Check connection." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-pop ${isDark ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <div className="h-16 sm:h-20 border-b border-black/5 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 backdrop-blur-xl sticky top-0 z-10 bg-inherit">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">PP</div>
          <div>
            <h2 className="text-sm sm:text-lg font-bold tracking-tight">AI Coach</h2>
            <div className="flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
              <p className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                {isLiveMode ? 'Live Voice Active' : 'Active Protocol'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={startLiveSession}
            disabled={isConnecting}
            className={`px-4 sm:px-6 h-8 sm:h-10 rounded-full font-bold text-[8px] sm:text-[10px] uppercase tracking-widest transition-all flex items-center space-x-2 ${
              isLiveMode 
              ? 'bg-red-600 text-white border-red-500' 
              : isDark ? 'bg-white text-black border-transparent' : 'bg-black text-white border-transparent'
            }`}
          >
            <span className={isLiveMode ? 'animate-pulse' : ''}>●</span>
            <span>{isConnecting ? 'Connecting...' : isLiveMode ? 'End Live' : 'Go Live'}</span>
          </button>
          <button 
            onClick={() => { stopLiveSession(); onBack(); }}
            className={`px-4 h-8 sm:h-10 rounded-full font-bold text-[8px] sm:text-[10px] uppercase tracking-widest border ${isDark ? 'border-white/10' : 'border-black/5'}`}
          >
            Exit
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 hide-scrollbar pb-40">
          {isLiveMode ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade">
               <div className="relative">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-blue-600/10 flex items-center justify-center">
                     <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-600 flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/50">
                        <span className="text-white text-4xl">🎙️</span>
                     </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black">Listening...</h3>
                  <p className="text-xs sm:text-sm font-bold opacity-40 uppercase tracking-widest">Speak naturally to your coach</p>
               </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}>
                  <div className={`max-w-[90%] sm:max-w-[85%] p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-[11px] sm:text-sm font-medium leading-relaxed shadow-sm ${
                    m.type === 'user' ? 'bg-blue-600 text-white' : isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-bold opacity-30 animate-pulse">Coach is thinking...</div>}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isLiveMode && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 backdrop-blur-xl border-t ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'}`}>
            <div className="mb-3 flex space-x-2 overflow-x-auto hide-scrollbar">
              {FAQS.map((faq, i) => (
                <button key={i} onClick={() => handleSendMessage(faq.q)} className="whitespace-nowrap px-3 py-1.5 rounded-full text-[9px] font-bold border dark:bg-zinc-900 dark:text-zinc-400">
                  {faq.q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative flex items-center">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query Coach..."
                className={`w-full py-4 pl-6 pr-14 rounded-full border font-semibold text-xs sm:text-sm outline-none ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-zinc-50'}`}
              />
              <button type="submit" disabled={!input.trim()} className="absolute right-2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">↑</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
