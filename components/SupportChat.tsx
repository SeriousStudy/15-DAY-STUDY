
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

async function callGenAI(prompt: string, retries = 3, delay = 1000): Promise<string> {
  let apiKey: string | undefined;
  try {
    apiKey = typeof process !== 'undefined' ? process.env?.API_KEY : undefined;
  } catch (e) {
    apiKey = undefined;
  }

  if (!apiKey) {
    console.error("PROTOCOL FAILURE: API_KEY environment variable is undefined.");
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction: "You are the Elite Accountancy Consultant. Precise, expert, and professional. You help students master complex accounting concepts. No filler. Big Four style delivery.",
        temperature: 0.6,
      },
    });
    return response.text || "Protocol failure: Null response.";
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      await new Promise(res => setTimeout(res, delay));
      return callGenAI(prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

const SupportChat: React.FC<{ onBack: () => void; initialMessage?: string }> = ({ onBack, initialMessage }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: "Elite Consultant Node initialized. State your audit requirement." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);
    try {
      const result = await callGenAI(text);
      setMessages(prev => [...prev, { type: 'bot', text: result }]);
    } catch (error: any) {
      if (error.message === "API_KEY_MISSING") {
        setConfigError(true);
      }
      setMessages(prev => [...prev, { type: 'bot', text: "Consultant connection dropped. Verify API settings in Vercel." }]);
    } finally { setIsTyping(false); }
  }, [isTyping]);

  useEffect(() => {
    if (initialMessage && messages.length === 1) handleSendMessage(initialMessage);
  }, [initialMessage, handleSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (configError) {
    return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-10 text-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-8 shadow-2xl shadow-red-600/30">!</div>
        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase text-red-600">Protocol Offline</h2>
        <p className="max-w-md text-sm opacity-60 leading-relaxed font-bold uppercase tracking-widest">
          The variable <span className="text-red-600">API_KEY</span> was not detected. 
          Please ensure your Vercel Environment Variables are set with Key: "API_KEY" and Value: "[Your Key]".
        </p>
        <button onClick={onBack} className="mt-12 px-12 py-5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col animate-pop ${isDark ? 'bg-black text-white' : 'bg-[#fafafa] text-zinc-950'}`}>
      <div className="h-28 border-b border-white/5 flex items-center justify-between px-10 glass sticky top-0 bg-inherit/80">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black italic shadow-2xl shadow-blue-500/20 text-2xl">PP</div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter">Analytical Hub</h2>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Node Sync Active</span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest border border-black/10 dark:border-white/10 hover:bg-white/5 transition-all">EXIT NODE</button>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-12 space-y-10 hide-scrollbar pb-52">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-8 rounded-[3rem] text-[15px] font-bold leading-relaxed border ${
                m.type === 'user' ? 'bg-blue-600 text-white border-blue-500 rounded-br-none shadow-2xl' : 'bg-white/5 border-white/10 rounded-bl-none shadow-2xl backdrop-blur-3xl'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="flex space-x-3 p-10"><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-12 glass bg-inherit/80 border-t border-black/5 dark:border-white/5">
          <form onSubmit={e => { e.preventDefault(); handleSendMessage(input); }} className="relative max-w-5xl mx-auto">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Submit Query to Analytical Hub..." className={`w-full py-8 px-12 rounded-[2.5rem] border-2 outline-none font-black text-lg transition-all ${isDark ? 'bg-black border-white/5 focus:border-blue-600 text-white' : 'bg-white border-black/5 focus:border-blue-600 text-black'}`} />
            <button type="submit" className="absolute right-5 top-4 w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform">↑</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
