
import React, { useState, useEffect } from 'react';
import { Subject, UserStats } from './types';
import { INITIAL_STATS } from './constants';
import Dashboard from './components/Dashboard';
import TutorChat from './components/TutorChat';
import { sounds } from './services/soundService';
import { useLocalStorage } from './hooks/useLocalStorage';

type Tab = 'home' | 'quests' | 'store' | 'profile';

const App: React.FC = () => {
  const [stats, setStats] = useLocalStorage<UserStats>('alamo_user_stats', INITIAL_STATS);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!stats.notificationsEnabled || !stats.reminderTime) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentHm === stats.reminderTime) {
        const lastRemindedDate = localStorage.getItem('alamo_last_reminder_date');
        const todayDate = now.toDateString();

        if (lastRemindedDate !== todayDate) {
          triggerNotification();
          localStorage.setItem('alamo_last_reminder_date', todayDate);
        }
      }
    };

    const triggerNotification = async () => {
      if (Notification.permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification("Oya, Time to Study!", {
            body: "Alámò is waiting for you in the STEM lab. Keep your streak alive!",
            icon: "https://picsum.photos/192/192",
            badge: "https://picsum.photos/96/96",
            vibrate: [200, 100, 200],
            tag: 'daily-reminder'
          } as any);
          
          if ('setAppBadge' in navigator) {
            (navigator as any).setAppBadge(1);
          }
        } catch (e) {
          console.warn("Notification failed", e);
        }
      }
    };

    const interval = setInterval(checkReminder, 30000);
    return () => clearInterval(interval);
  }, [stats.notificationsEnabled, stats.reminderTime]);

  const handleToggleNotifications = async () => {
    if (!stats.notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setStats({ ...stats, notificationsEnabled: true });
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification("Oshey!", {
            body: "Daily reminders are now active. We go see for class!",
            icon: "https://picsum.photos/192/192",
          });
        } catch (e) { console.warn(e); }
      } else {
        alert("Pele, you need to enable notifications in your browser settings first.");
      }
    } else {
      setStats({ ...stats, notificationsEnabled: false });
      if ('clearAppBadge' in navigator) {
        (navigator as any).clearAppBadge();
      }
    }
  };

  const handleUpdateReminderTime = (time: string) => {
    setStats({ ...stats, reminderTime: time });
  };

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to clear your learning progress? This cannot be undone.")) {
      setStats(INITIAL_STATS);
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleQuestSuccess = () => {
    if (!activeSubject) return;
    sounds.playSuccess();
    const newStats = {
      ...stats,
      coins: stats.coins + 10,
      progress: {
        ...stats.progress,
        [activeSubject]: Math.min(100, (stats.progress[activeSubject] || 0) + 5)
      }
    };
    setStats(newStats);
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge();
    }
  };

  const useCredits = (amount: number): boolean => {
    if (stats.credits < amount) return false;
    const newStats = { ...stats, credits: stats.credits - amount };
    setStats(newStats);
    return true;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#008751] flex items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center text-4xl animate-bounce">🎓</div>
        <div className="text-white font-black text-2xl italic animate-pulse">Alámò is waking up...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#061a11] transition-colors duration-300 flex flex-col items-center">
      {/* Subject Lab Chat Overlay (Desktop-Responsive Modal) */}
      {activeSubject && (
        <TutorChat 
          subject={activeSubject} 
          user={{ uid: 'local-user' }} 
          streak={stats.streak}
          onBack={() => setActiveSubject(null)}
          onSuccess={handleQuestSuccess}
          useCredits={useCredits}
        />
      )}

      <div className="w-full flex flex-col min-h-screen relative shadow-2xl bg-white/30 dark:bg-black/20 backdrop-blur-sm">
        
        {/* Responsive Header - Centers and Expands on Desktop */}
        <header className="bg-[#008751] dark:bg-green-950 pt-10 pb-16 px-6 sm:px-12 rounded-b-[60px] shadow-2xl relative z-10 w-full overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white italic tracking-tighter flex items-center gap-3">
                Alámò <span className="text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">AI</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-green-100 uppercase tracking-[4px] mt-2 opacity-80">
                The Resilient STEM Tutor for WAEC/JAMB
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-[24px] border-2 border-[#FFD700]/40 shadow-xl group hover:scale-105 transition-transform duration-300">
                <span className="text-2xl animate-pulse group-hover:rotate-12 transition-transform">🔥</span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-lg font-black text-white">{stats.streak}</span>
                  <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-tighter">Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Multi-column support on Desktop */}
        <main className="flex-1 -mt-10 relative z-20 px-4 sm:px-8 lg:px-12 pb-32 w-full max-w-7xl mx-auto">
          <Dashboard 
            activeTab={activeTab}
            stats={stats} 
            onSelectSubject={(sub) => {
              sounds.init();
              setActiveSubject(sub);
            }} 
            onReset={handleResetProgress} 
            onToggleNotifications={handleToggleNotifications}
            onUpdateReminderTime={handleUpdateReminderTime}
          />
        </main>

        {/* Floating Navigation Dock - Adapts position for desktop */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 w-[95%] max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[40px] border-2 border-white/50 dark:border-white/10 shadow-[0_20px_50px_rgba(0,135,81,0.3)] flex items-center justify-around px-6 z-40 transition-all hover:scale-[1.02]">
          {[
            { id: 'home', icon: '🏠', label: 'Learn' },
            { id: 'quests', icon: '🏆', label: 'Quests' },
            { id: 'store', icon: '🛒', label: 'Store' },
            { id: 'profile', icon: '👤', label: 'Me' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as Tab);
                sounds.init();
              }}
              className={`flex flex-col items-center transition-all duration-300 relative ${activeTab === t.id ? 'scale-110 -translate-y-1' : 'opacity-40 hover:opacity-100'}`}
            >
              <span className={`text-2xl mb-1 ${activeTab === t.id ? 'drop-shadow-[0_0_8px_rgba(0,135,81,0.5)]' : ''}`}>{t.icon}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === t.id ? 'text-[#008751] dark:text-green-400' : 'text-gray-500'}`}>
                {t.label}
              </span>
              {activeTab === t.id && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#008751] rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
