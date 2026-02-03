
import React from 'react';
import { Subject, UserStats } from '../types';
import Wallet from './Wallet';
import QuestCard from './QuestCard';

interface DashboardProps {
  activeTab: 'home' | 'quests' | 'store' | 'profile';
  stats: UserStats;
  onSelectSubject: (subject: Subject) => void;
  onReset: () => void;
  onLogout: () => void;
  onToggleNotifications?: () => void;
  onUpdateReminderTime?: (time: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  activeTab, 
  stats, 
  onSelectSubject, 
  onReset, 
  onLogout,
  onToggleNotifications, 
  onUpdateReminderTime 
}) => {
  const subjects = [
    { id: Subject.Physics, icon: '⚡', color: 'bg-blue-600', label: 'Physics', desc: 'Matter & Mechanics' },
    { id: Subject.Math, icon: '📐', color: 'bg-red-600', label: 'Mathematics', desc: 'Calculus & Algebra' },
    { id: Subject.Chemistry, icon: '🧪', color: 'bg-emerald-600', label: 'Chemistry', desc: 'Atoms & Reactions' },
    { id: Subject.Biology, icon: '🧬', color: 'bg-orange-600', label: 'Biology', desc: 'Life & Systems' },
  ];

  const renderHome = () => (
    <div className="space-y-8 animate__animated animate__fadeIn">
      <Wallet coins={stats.coins} credits={stats.credits} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[12px] font-black text-gray-700 dark:text-green-400 uppercase tracking-[3px] mb-4 px-1">
            Subject Labs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className="flex flex-col items-start gap-4 bg-white dark:bg-white/5 p-6 rounded-[32px] border-2 border-transparent hover:border-[#008751] dark:hover:border-green-500 transition-all group active:scale-95 shadow-xl hover:shadow-[#0087511a] backdrop-blur-md"
              >
                <div className={`w-14 h-14 rounded-2xl ${sub.color} flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform text-white`}>
                  {sub.icon}
                </div>
                <div className="text-left w-full">
                  <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight mb-2">{sub.label}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-[#008751]" style={{ width: `${stats.progress[sub.id] || 0}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-[#008751] dark:text-green-500">{(stats.progress[sub.id] || 0)}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[12px] font-black text-gray-700 dark:text-green-400 uppercase tracking-[3px] mb-4 px-1">
            Leaderboard
          </h3>
          <div className="bg-white/80 dark:bg-white/5 p-6 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/10 shadow-sm backdrop-blur-md">
            <div className="space-y-4">
              {[
                { name: 'Oluwaseun', score: '2,450', rank: '🥇', level: 'Lvl 12' },
                { name: 'Chioma', score: '2,100', rank: '🥈', level: 'Lvl 10' },
                { name: 'You', score: stats.coins.toString(), rank: '🥉', me: true, level: 'Lvl 4' },
              ].map((u, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-2xl transition-all ${u.me ? 'bg-[#008751]/10 border border-[#008751]/30 shadow-inner scale-105' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{u.rank}</span>
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${u.me ? 'text-[#008751] dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>{u.name}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">{u.level}</span>
                    </div>
                  </div>
                  <span className="font-black text-xs text-gray-600 dark:text-gray-400">{u.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-8 animate__animated animate__fadeIn">
      <Wallet coins={stats.coins} credits={stats.credits} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuestCard 
          title="Newton's Disciple" 
          subject={Subject.Physics} 
          progress={stats.progress[Subject.Physics] || 0} 
          description="Master mechanics and earn the respect of Alámò. Perfect for students targeting 300+ in JAMB."
          onClick={() => onSelectSubject(Subject.Physics)}
        />
        <QuestCard 
          title="Alchemist" 
          subject={Subject.Chemistry} 
          progress={stats.progress[Subject.Chemistry] || 0} 
          description="Understand the bonds that hold the world together. Dive deep into Organic Chemistry."
          onClick={() => onSelectSubject(Subject.Chemistry)}
        />
        <QuestCard 
          title="Integral Master" 
          subject={Subject.Math} 
          progress={stats.progress[Subject.Math] || 0} 
          description="Calculus no go fit shake you again! Tackle WAEC Past Questions with ease."
          onClick={() => onSelectSubject(Subject.Math)}
        />
        <QuestCard 
          title="Systematic Scholar" 
          subject={Subject.Biology} 
          progress={stats.progress[Subject.Biology] || 0} 
          description="From cell theory to ecology, become a living textbook of knowledge."
          onClick={() => onSelectSubject(Subject.Biology)}
        />
      </div>
    </div>
  );

  const renderStore = () => (
    <div className="space-y-8 animate__animated animate__fadeIn">
      <Wallet coins={stats.coins} credits={stats.credits} />
      <div className="bg-gradient-to-br from-[#008751] to-green-800 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
        <h3 className="text-3xl font-black italic mb-2 relative z-10">Data Marketplace</h3>
        <p className="text-sm font-bold opacity-80 relative z-10 max-w-md">No NEPA? No Problem. Exchange your hard-earned Eko-Coins for Sachet Data bundles to keep learning anywhere.</p>
        <div className="absolute right-8 bottom-8 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">📡</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { coins: 50, credits: 100, label: 'Small Sachet', desc: '10 Questions', icon: '📦' },
          { coins: 150, credits: 350, label: 'Standard Pack', desc: '40 Questions', icon: '💎' },
          { coins: 400, credits: 1000, label: 'Mega Bundle', desc: 'Unlimited Reasoning', icon: '🚀' },
        ].map((item, i) => (
          <button key={i} className="flex flex-col items-start bg-white dark:bg-white/5 p-6 rounded-[32px] border-2 border-gray-200 dark:border-white/10 hover:border-[#FFD700] active:scale-95 transition-all shadow-xl backdrop-blur-md">
             <div className="w-16 h-16 bg-gray-50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
               {item.icon}
             </div>
             <div className="text-left mb-6">
               <h4 className="font-black text-lg text-gray-900 dark:text-white leading-none mb-1">{item.label}</h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
             </div>
             <div className="w-full flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-lg font-black text-[#008751] dark:text-green-500">+{item.credits} Credits</span>
                <div className="bg-[#FFD700] px-4 py-2 rounded-xl font-black text-xs text-yellow-950 shadow-sm">
                  {item.coins} 🪙
                </div>
             </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8 animate__animated animate__fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center text-center p-10 bg-white dark:bg-white/5 rounded-[50px] border-2 border-gray-100 dark:border-white/10 shadow-2xl backdrop-blur-md h-full">
            <div className="w-28 h-28 bg-[#008751] rounded-full flex items-center justify-center text-5xl shadow-2xl mb-6 text-white font-black italic relative">
              S
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#FFD700] rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-xl">✨</div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Scholar One</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Lagos Island District</p>
            
            <div className="grid grid-cols-2 gap-8 w-full mt-10">
               <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-3xl">
                 <div className="text-3xl font-black text-[#008751] dark:text-green-400">{stats.streak}</div>
                 <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Day Streak</div>
               </div>
               <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-3xl">
                 <div className="text-3xl font-black text-[#FFD700] dark:text-yellow-500">{stats.coins}</div>
                 <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Eko-Coins</div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-white/5 p-8 rounded-[40px] border-2 border-gray-100 dark:border-white/10 shadow-sm backdrop-blur-md">
            <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-[2px] mb-6">Learning Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-sm">🔔</div>
                  <div className="text-left">
                    <h4 className="font-black text-sm text-gray-900 dark:text-white leading-none">Daily Reminders</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tighter">Stay consistent with your goals</p>
                  </div>
                </div>
                <button 
                  onClick={onToggleNotifications}
                  className={`w-14 h-8 rounded-full transition-all relative ${stats.notificationsEnabled ? 'bg-[#008751] shadow-[0_0_15px_rgba(0,135,81,0.4)]' : 'bg-gray-300 dark:bg-white/20'}`}
                >
                  <div className={`absolute top-1.5 left-1.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${stats.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {stats.notificationsEnabled && (
                <div className="flex items-center justify-between p-4 bg-[#008751]/5 rounded-3xl border border-[#008751]/20 animate__animated animate__fadeIn">
                  <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Target Time</span>
                  <input 
                    type="time" 
                    value={stats.reminderTime} 
                    onChange={(e) => onUpdateReminderTime?.(e.target.value)}
                    className="bg-white dark:bg-white/10 px-6 py-2 rounded-xl text-sm font-black text-[#008751] dark:text-green-400 border-2 border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-[#008751]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-3xl opacity-60 cursor-not-allowed">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-xl shadow-sm">🌓</div>
                   <h4 className="font-black text-sm text-gray-900 dark:text-white">Dark Mode</h4>
                 </div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white dark:bg-white/5 rounded-full">System</span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                onClick={onLogout}
                className="w-full p-6 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-3xl border-2 border-gray-200 dark:border-white/10 font-black flex items-center justify-center gap-3 text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
              >
                <span>🚪</span> Sign Out (Logout from Lab)
              </button>

              <button 
                onClick={onReset}
                className="w-full p-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl border-2 border-dashed border-red-200 dark:border-red-900/40 font-black flex items-center justify-center gap-3 text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
              >
                <span>🧨</span> Erase My Data & Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-2">
      {activeTab === 'home' && renderHome()}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'store' && renderStore()}
      {activeTab === 'profile' && renderProfile()}
    </div>
  );
};

export default Dashboard;
