
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
    { type: 'bot', text: "Hey! I'm your casual sidekick. Ask me anything!" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getApiKey = () => {
    try {
      return typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setMessages(prev => [...prev, { type: 'bot', text: "ERROR: API_KEY is missing from environment variables." }]);
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
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let foundImage = false;
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
            setMessages(prev => [...prev, { type: 'bot', imageUrl, text: "Generated!" }]);
            foundImage = true;
          }
        }
        if (!foundImage) throw new Error("Image Generation Failed.");
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userText,
          config: {
            systemInstruction: "Friendly sidekick. Brief answers.",
          }
        });
        setMessages(prev => [...prev, { type: 'bot', text: response.text || "Empty response." }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { type: 'bot', text: `ERROR: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed z-[100] transition-all duration-300 ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-8 sm:right-8' : 'bottom-8 right-8'}`}>
      {isOpen && (
        <div className={`flex flex-col h-full sm:h-[500px] w-full sm:w-[380px] sm:rounded-[2.5rem] shadow-2xl border ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/5'}`}>
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-blue-600 sm:rounded-t-[2.5rem] text-white">
            <p className="font-bold text-sm">Casual Sidekick</p>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl ${m.type === 'user' ? 'bg-blue-600 text-white' : isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                  {m.text && <p className="text-xs font-medium leading-relaxed">{m.text}</p>}
                  {m.imageUrl && <img src={m.imageUrl} alt="AI Visual" className="mt-3 rounded-xl w-full" />}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] opacity-30">Typing...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-black/5 dark:border-white/5">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask or Draw..." className="w-full py-3 px-5 rounded-full text-xs font-bold outline-none border dark:bg-black dark:border-white/10 dark:text-white" />
          </form>
        </div>
      )}

      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 shadow-2xl text-white text-2xl">
          💬
        </button>
      )}
    </div>
  );
};

export default CasualChat;
