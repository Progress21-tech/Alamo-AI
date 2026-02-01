
import React, { useState, useRef, useEffect } from 'react';
import { Subject, ChatMessage } from '../types';
import { askAlamo } from '../services/geminiService';
import { sounds } from '../services/soundService';

interface TutorChatProps {
  subject: Subject;
  user: { uid: string };
  streak: number;
  onBack: () => void;
  onSuccess: () => void;
  useCredits: (amount: number) => boolean;
}

const TutorChat: React.FC<TutorChatProps> = ({ subject, user, streak, onBack, onSuccess, useCredits }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [praise, setPraise] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const historyKey = `alamo_history_${subject}`;

  const subjectPraise: Record<Subject, string[]> = {
    [Subject.Physics]: ["Gbayi! Newton don bow!", "Potential Energy check! ✅", "Frequency tuned well!", "Oshey! You're moving at light speed!"],
    [Subject.Math]: ["X don find his master!", "Logic is 100%!", "Geometric Genius!", "Opor! Numbers don surrender!"],
    [Subject.Chemistry]: ["Reaction is balanced well!", "The bonds are strong!", "Pure element of success!", "The solution is clear!"],
    [Subject.Biology]: ["DNA of a scholar!", "Brain cells dey fire!", "Life Science guru!", "Naturally gifted!"]
  };

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages([{ 
            role: 'model', 
            text: `Bawo ni, omo mi! I am Alámò, your ${subject} expert. Ready to master some topics today? Oya, shoot your question!`, 
            timestamp: Date.now() 
          }]);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
      setIsHistoryLoading(false);
    };
    loadHistory();
  }, [subject]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveToLocal = (newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(historyKey, JSON.stringify(newMessages));
    } catch (e) {
      console.warn("Local storage full, could not save history", e);
    }
  };

  const showPraise = () => {
    const options = subjectPraise[subject];
    const randomPraise = options[Math.floor(Math.random() * options.length)];
    setPraise(randomPraise);
    setTimeout(() => setPraise(null), 3500);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!useCredits(10)) {
      const errorMsg: ChatMessage = { role: 'model', text: "Eyah! Your sachet credits don finish o. Master more quests to earn coins and top up!", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    sounds.playMessageSent();
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    saveToLocal(updatedWithUser);
    
    setInput('');
    setIsLoading(true);

    const historyForGemini = updatedWithUser.slice(-10).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await askAlamo(input, subject, historyForGemini);
    
    sounds.playMessageReceived();
    const modelMsg: ChatMessage = { role: 'model', text: response, timestamp: Date.now() };
    const finalMessages = [...updatedWithUser, modelMsg];
    setMessages(finalMessages);
    saveToLocal(finalMessages);
    
    const lowerRes = response.toLowerCase();
    const successKeywords = ['correct', 'sabi', 'oshey', 'gbayi', 'opor', 'sharp', 'excellent', 'praise', 'correctly', 'mad oh', 'gbogbo e'];
    
    if (successKeywords.some(keyword => lowerRes.includes(keyword))) {
      onSuccess();
      showPraise();
    }
    setIsLoading(false);
  };

  const subjectGradients = {
    [Subject.Physics]: 'from-blue-500 to-blue-700',
    [Subject.Math]: 'from-red-500 to-red-700',
    [Subject.Chemistry]: 'from-emerald-500 to-emerald-700',
    [Subject.Biology]: 'from-orange-500 to-orange-700'
  };

  return (
    <div className="fixed inset-0 bg-[#008751]/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-0 md:p-6 lg:p-12 animate__animated animate__fadeIn">
      <div className="w-full max-w-4xl h-full md:h-[90vh] bg-[#f0fdf4] dark:bg-[#061a11] flex flex-col md:rounded-[40px] shadow-2xl overflow-hidden border-t-8 md:border-t-0 md:border-l-8 border-[#FFD700] relative">
        
        <header className="bg-white dark:bg-gray-950 p-6 flex items-center justify-between shadow-xl border-b-2 border-gray-100 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center active:scale-90 transition-all hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#008751] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg font-black italic">A</div>
               <div>
                  <h2 className="font-black text-xl text-[#008751] dark:text-green-400 leading-none">Alámò</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1">{subject} Lab</p>
               </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-[#008751]/10 px-4 py-2 rounded-2xl border border-[#008751]/20">
            <span className="text-base">🔥</span>
            <span className="text-[10px] font-black text-[#008751] dark:text-green-400 uppercase tracking-tighter">
              {streak} DAY STREAK
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#008751]"></div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Opening Lab Notebook...</span>
            </div>
          ) : messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate__animated animate__fadeInUp animate__faster`}>
              <div className={`max-w-[90%] md:max-w-[80%] p-5 rounded-[28px] shadow-sm relative ${msg.role === 'user' ? 'bg-[#008751] text-white rounded-tr-none' : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-100 border-2 border-gray-100 dark:border-white/5 rounded-tl-none'}`}>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                <span className="text-[8px] opacity-40 absolute bottom-2 right-4 uppercase font-black">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-black/20 w-fit rounded-full backdrop-blur-md border border-white/50 dark:border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#008751] rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-[#008751] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-[#008751] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-[10px] font-black text-[#008751] dark:text-green-400 uppercase tracking-[2px]">Alámò is reasoning...</span>
            </div>
          )}
          <div ref={scrollRef} />

          {/* Floating Praise Toast */}
          {praise && (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] animate__animated animate__zoomIn">
              <div className={`bg-gradient-to-r ${subjectGradients[subject]} text-white px-10 py-5 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col items-center gap-3 border-4 border-white/50 backdrop-blur-xl`}>
                <span className="text-5xl">🌟</span>
                <span className="font-black text-xl md:text-2xl uppercase tracking-widest text-center">{praise}</span>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-[4px]">+10 Eko-Coins!</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-gray-950 border-t-2 border-gray-100 dark:border-white/5 shadow-inner">
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask Alámò anything about ${subject}...`}
                className="w-full bg-gray-50 dark:bg-white/5 rounded-[24px] px-8 py-5 outline-none text-base font-medium focus:ring-4 focus:ring-[#008751]/20 dark:text-white border-2 border-transparent focus:border-[#008751] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest hidden md:block">
                Press Enter
              </div>
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-16 h-16 bg-[#FFD700] hover:bg-[#ffed4a] rounded-[24px] flex items-center justify-center text-[#008751] shadow-xl hover:shadow-[#FFD700]/30 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;
