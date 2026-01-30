
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  type: 'bot' | 'user';
  text?: string;
  imageUrl?: string;
}

const CasualChat: React.FC = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: "Hey! I'm your casual sidekick. Ask me anything, or tell me to 'draw an image' to see some magic!" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = window.innerWidth < 640 ? 'hidden' : 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, { type: 'bot', text: "Critical Config Error: API_KEY is missing from your Vercel settings. Switch Key and Value columns!" }]);
      return;
    }

    const userText = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const isImageRequest = /\b(generate|create|draw|make|show|picture|image|photo|art|sketch)\b/i.test(userText);

      if (isImageRequest) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: userText }] },
          config: {
            imageConfig: { aspectRatio: "1:1" }
          }
        });

        let foundImage = false;
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
            setMessages(prev => [...prev, { type: 'bot', imageUrl, text: "Here's what I created!" }]);
            foundImage = true;
          } else if (part.text && !foundImage) {
             setMessages(prev => [...prev, { type: 'bot', text: part.text }]);
          }
        }
        if (!foundImage) {
          setMessages(prev => [...prev, { type: 'bot', text: "I couldn't quite visualize that. Rephrase your request!" }]);
        }
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userText,
          config: {
            systemInstruction: "You are a friendly, casual sidekick. Keep answers brief and witty. Part of the Bootcamp by Piyush Pandey.",
          }
        });
        setMessages(prev => [...prev, { type: 'bot', text: response.text || "I'm drawing a blank, try again!" }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { type: 'bot', text: "Network glitch. Ensure your API Key is correct in Vercel." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed z-[100] transition-all duration-300 ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-8 sm:right-8' : 'bottom-8 right-8'}`}>
      {isOpen && (
        <div className={`flex flex-col h-full sm:h-[500px] w-full sm:w-[380px] sm:rounded-[2.5rem] shadow-2xl border transition-all animate-pop origin-bottom-right ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/5'}`}>
          <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-blue-600 sm:rounded-t-[2.5rem]">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✨</div>
              <div>
                <p className="text-white font-bold text-sm">Casual Sidekick</p>
                <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">General AI & Art</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 hide-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}>
                <div className={`max-w-[90%] p-4 rounded-2xl sm:rounded-3xl ${
                  m.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : isDark ? 'bg-zinc-800 text-white rounded-bl-none' : 'bg-zinc-100 text-black rounded-bl-none'
                }`}>
                  {m.text && <p className="text-[11px] sm:text-xs font-medium leading-relaxed">{m.text}</p>}
                  {m.imageUrl && (
                    <img 
                      src={m.imageUrl} 
                      alt="AI Visual" 
                      className="mt-3 rounded-xl sm:rounded-2xl w-full aspect-square object-cover shadow-sm bg-zinc-700" 
                    />
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-4 rounded-2xl rounded-bl-none ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                   <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'} bg-transparent mb-safe`}>
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask or Draw..."
                className={`w-full py-3.5 pl-5 pr-14 rounded-full text-xs font-bold outline-none border transition-all ${isDark ? 'bg-black border-white/10 focus:border-blue-500/50 text-white' : 'bg-zinc-50 border-black/10 focus:border-blue-500/30 text-black'}`}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`absolute right-1.5 top-1.5 w-10 h-10 rounded-full flex items-center justify-center transition-all ${input.trim() && !isTyping ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-500/10 text-zinc-500'}`}
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-blue-600 shadow-2xl transition-all hover-pop group shadow-blue-500/30"
        >
          <div className="relative">
            <span className="text-white text-xl sm:text-2xl">💬</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-black"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default CasualChat;
