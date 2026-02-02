
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#061a11] overflow-hidden flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#008751] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFD700] rounded-full blur-3xl"></div>
        </div>

        <div className="w-24 h-24 bg-[#008751] rounded-[32px] flex items-center justify-center text-4xl shadow-2xl mb-8 animate__animated animate__bounceIn">
          🎓
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white italic tracking-tighter mb-6">
          Meet <span className="text-[#008751]">Alámò</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
          The world's first <span className="text-[#008751] font-bold">Yoruba-Glish</span> AI Tutor. 
          Master Physics, Math, and Chemistry with local vibes. 
          Designed specifically for WAEC & JAMB success.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-[#008751] text-white rounded-[24px] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all animate-pulse-glow"
          >
            Get Started Free
          </button>
          <a 
            href="#how-it-works"
            className="px-10 py-5 bg-white dark:bg-white/5 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-white/10 rounded-[24px] font-black text-lg hover:bg-gray-50 transition-all"
          >
            How it Works
          </a>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="bg-gray-50 dark:bg-black/20 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-[#008751]">300+</h3>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Target JAMB Score</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-[#008751]">Yoruba</h3>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Culturally Aware AI</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-[#008751]">Sachet</h3>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Data-Efficient Learning</p>
          </div>
        </div>
      </section>

      {/* "The Alámò Vibe" */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-[#FFD700] rounded-[48px] p-8 shadow-2xl rotate-2">
              <p className="text-2xl font-black italic text-yellow-950">
                "Oya, listen well well. If current flow like Lagos traffic for Third Mainland Bridge, we call am Resistance. You sabi?"
              </p>
              <p className="mt-4 text-sm font-bold opacity-70">— Alámò AI</p>
            </div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#008751] rounded-full flex items-center justify-center text-white text-2xl shadow-xl">💡</div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight">Learning that understands your <span className="text-[#008751]">vibe.</span></h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
              We stopped the boring textbooks. Alámò explains Science using things you see every day—from Jollof rice to Danfo buses.
            </p>
            <ul className="space-y-4">
              {['Real Past Questions', 'Eko-Coin Rewards', 'No NEPA? No Problem (Offline Ready)'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 font-black text-sm text-[#008751]">
                  <span className="w-6 h-6 bg-[#008751]/10 rounded-full flex items-center justify-center">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 text-center border-t border-gray-100 dark:border-white/5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[4px]">EkoQuest Project &copy; 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;
