
import React, { useState, useEffect } from 'react';
import { Subject, UserStats } from './types';
import { INITIAL_STATS } from './constants';
import Dashboard from './components/Dashboard';
import TutorChat from './components/TutorChat';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import { sounds } from './services/soundService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { supabase, checkSupabaseConfig } from './services/supabase';

type Tab = 'home' | 'quests' | 'store' | 'profile';
type AppState = 'splash' | 'landing' | 'auth' | 'main';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [stats, setStats] = useLocalStorage<UserStats>('alamo_user_stats', INITIAL_STATS);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          setAppState('main');
        } else {
          setAppState('landing');
        }
      } catch (e) {
        console.warn("Auth initialization failed - likely unconfigured Supabase", e);
        setAppState('landing');
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setSession(session);
      if (session) {
        setAppState('main');
      } else {
        setAppState('landing');
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
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
      } else {
        alert("Pele, you need to enable notifications in your browser settings first.");
      }
    } else {
      setStats({ ...stats, notificationsEnabled: false });
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAppState('landing');
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
  };

  const useCredits = (amount: number): boolean => {
    if (stats.credits < amount) return false;
    const newStats = { ...stats, credits: stats.credits - amount };
    setStats(newStats);
    return true;
  };

  if (appState === 'splash') return (
    <div className="min-h-screen bg-[#008751] flex items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center text-5xl animate-bounce">🎓</div>
        <div className="text-white font-black text-3xl italic animate-pulse">Alámò is waking up...</div>
      </div>
    </div>
  );

  if (appState === 'landing') return (
    <LandingPage onStart={() => setAppState('auth')} />
  );

  if (appState === 'auth') return (
    <AuthForm 
      onSuccess={() => setAppState('main')} 
      onBack={() => setAppState('landing')} 
    />
  );

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-[#061a11] transition-colors duration-300 flex flex-col items-center">
      {!checkSupabaseConfig() && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-[10px] font-black p-2 z-[100] text-center uppercase tracking-widest shadow-lg">
          ⚠️ Configuration Incomplete: Check Vercel Build Command & Env Vars for API_KEY, SUPABASE_URL, and SUPABASE_ANON_KEY.
        </div>
      )}

      {activeSubject && (
        <TutorChat 
          subject={activeSubject} 
          user={{ uid: session?.user?.id || 'local-user' }} 
          streak={stats.streak}
          onBack={() => setActiveSubject(null)}
          onSuccess={handleQuestSuccess}
          useCredits={useCredits}
        />
      )}

      <div className="w-full flex flex-col min-h-screen relative shadow-2xl bg-white/30 dark:bg-black/20 backdrop-blur-sm">
        <header className="bg-[#008751] dark:bg-green-950 pt-10 pb-16 px-6 sm:px-12 rounded-b-[60px] shadow-2xl relative z-10 w-full overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white italic tracking-tighter flex items-center gap-3">
                Alámò <span className="text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">AI</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-green-100 uppercase tracking-[4px] mt-2 opacity-80">
                {session ? (
                  <>Logged in as <span className="text-white opacity-100 underline decoration-sunset decoration-2">{session?.user?.email?.split('@')[0]}</span></>
                ) : (
                  "Offline Mode (Progress saved locally)"
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-[24px] border-2 border-[#FFD700]/40 shadow-xl group hover:scale-105 transition-transform duration-300">
                <span className="text-2xl animate-pulse">🔥</span>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-lg font-black text-white">{stats.streak}</span>
                  <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-tighter">Day Streak</span>
                </div>
              </div>
              {session && (
                <button 
                  onClick={handleLogout} 
                  title="Sign Out"
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white text-xl hover:bg-white/20 transition-all shadow-lg active:scale-95 group relative"
                >
                  🚪
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap pointer-events-none">Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 -mt-10 relative z-20 px-4 sm:px-8 lg:px-12 pb-32 w-full max-w-7xl mx-auto">
          <Dashboard 
            activeTab={activeTab}
            stats={stats} 
            onSelectSubject={(sub) => {
              sounds.init();
              setActiveSubject(sub);
            }} 
            onReset={handleResetProgress} 
            onLogout={handleLogout}
            onToggleNotifications={handleToggleNotifications}
            onUpdateReminderTime={handleUpdateReminderTime}
          />
        </main>

        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-20 w-[95%] max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[40px] border-2 border-white/50 dark:border-white/10 shadow-[0_20px_50px_rgba(0,135,81,0.3)] flex items-center justify-around px-6 z-40">
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
