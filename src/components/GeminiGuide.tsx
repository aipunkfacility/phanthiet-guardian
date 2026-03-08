
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiGuideResponse } from '../services/gemini';
import { ChatMessage } from '../types';

const GeminiGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Xin chào! Я — Хранитель историй. Спрашивайте меня о чем угодно: о храмах Фантьета, их легендах или о том, как их посетить.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const response = await getGeminiGuideResponse(input, history);

    const botMsg: ChatMessage = { role: 'model', text: response, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${isOpen ? 'w-80 md:w-96' : 'w-14'}`}>
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-[500px] border border-stone-200 overflow-hidden">
          <div className="bg-orange-800 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center">
                ✨
              </div>
              <span className="font-semibold text-sm">Хранитель историй</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-700 p-1 rounded transition-colors" aria-label="Close chat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-stone-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

           <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Спросите о башнях..."
               className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
             />
             <button 
               onClick={handleSend}
               disabled={isLoading || !input.trim()}
               className="bg-orange-800 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50 transition-all shrink-0"
               aria-label="Send message"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
             </button>
           </div>
        </div>
       ) : (
         <button 
           onClick={() => setIsOpen(true)}
           className="w-14 h-14 bg-orange-800 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-orange-700 transition-all group"
           aria-label="Open chat"
         >
           <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
         </button>
       )}
    </div>
  );
};

export default GeminiGuide;
