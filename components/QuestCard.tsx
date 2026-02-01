
import React from 'react';
import { Subject } from '../types';

interface QuestCardProps {
  title: string;
  subject: Subject;
  progress: number;
  description: string;
  onClick: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ title, subject, progress, description, onClick }) => {
  const subjectConfig = {
    [Subject.Physics]: { 
      accent: '#3b82f6', 
      icon: '⚡',
      gradient: 'from-blue-400 to-blue-600'
    },
    [Subject.Math]: { 
      accent: '#ef4444', 
      icon: '📐',
      gradient: 'from-red-400 to-red-600'
    },
    [Subject.Chemistry]: { 
      accent: '#10b981', 
      icon: '🧪',
      gradient: 'from-emerald-400 to-emerald-600'
    },
    [Subject.Biology]: { 
      accent: '#f59e0b', 
      icon: '🧬',
      gradient: 'from-orange-400 to-orange-600'
    }
  };

  const config = subjectConfig[subject];
  const isCompleted = progress === 100;

  return (
    <button 
      onClick={onClick}
      className={`relative w-full text-left bg-white dark:bg-white/5 p-5 rounded-[32px] shadow-sm border-2 
        hover:scale-[1.02] active:scale-95 transition-all duration-500 ease-out overflow-hidden group 
        ${isCompleted 
          ? 'border-[#FFD700] animate-pulse-glow bg-gradient-to-br from-white to-yellow-50/30 dark:from-white/5 dark:to-yellow-900/10' 
          : 'border-transparent hover:border-gray-200 dark:hover:border-white/10'}`}
    >
      {/* Decorative background circle */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-5 bg-current transition-transform duration-700 group-hover:scale-125" 
        style={{ color: isCompleted ? '#FFD700' : config.accent }}
      ></div>
      
      <div className="flex gap-4 items-center mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6 
          ${isCompleted 
            ? 'bg-[#FFD700] text-yellow-900 shadow-yellow-500/20' 
            : `bg-gradient-to-br ${config.gradient} text-white shadow-${config.accent}/20`}`}>
          {isCompleted ? '✅' : config.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
             <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md 
               ${isCompleted 
                 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' 
                 : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
               {subject}
             </span>
             {isCompleted && (
               <span className="bg-[#008751] text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce uppercase tracking-tighter">
                 Mastered
               </span>
             )}
          </div>
          <h3 className={`font-black text-base leading-tight transition-colors duration-300
            ${isCompleted ? 'text-yellow-900 dark:text-yellow-500' : 'text-gray-800 dark:text-gray-100 group-hover:text-[#008751] dark:group-hover:text-green-400'}`}>
            {title}
          </h3>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
        {isCompleted ? "You've fully mastered this domain. Alámò is proud of you!" : description}
      </p>
      
      {/* Progress Bar Container */}
      <div className={`relative h-2.5 bg-gray-100 dark:bg-black/20 rounded-full ${isCompleted ? 'overflow-visible' : 'overflow-hidden'}`}>
        <div 
          className={`h-full transition-all duration-1000 ease-out relative rounded-full
            ${isCompleted 
              ? 'bg-[#FFD700] completed-bar-shimmer animate-pulse-glow z-10' 
              : `bg-gradient-to-r ${config.gradient}`}`} 
          style={{ width: `${progress}%` }}
        >
          {/* Inner pulse for the bar itself if completed */}
          {isCompleted && <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)]"></div>}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</span>
         <div className="flex items-center gap-1">
           {isCompleted && <span className="text-[10px]">✨</span>}
           <span className={`text-[10px] font-black ${isCompleted ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-600 dark:text-gray-400'}`}>
             {isCompleted ? '100% MASTERED' : `${progress}% Complete`}
           </span>
         </div>
      </div>
    </button>
  );
};

export default QuestCard;