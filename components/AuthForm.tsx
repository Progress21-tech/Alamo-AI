
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface AuthFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation link!");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong o!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#061a11] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[48px] shadow-2xl border-2 border-gray-100 dark:border-white/10 backdrop-blur-md relative overflow-hidden">
        <button onClick={onBack} className="absolute top-8 left-8 text-gray-400 hover:text-[#008751] font-black text-xs uppercase tracking-widest">
          ← Back
        </button>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#008751] rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg font-black italic">A</div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">{isLogin ? 'Welcome Back!' : 'Join the Lab'}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Alámò is waiting for you.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/20 rounded-[24px] px-8 py-5 outline-none text-base border-2 border-transparent focus:border-[#008751] transition-all dark:text-white"
              placeholder="scholar@ekoquest.ng"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/20 rounded-[24px] px-8 py-5 outline-none text-base border-2 border-transparent focus:border-[#008751] transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100 dark:border-red-900/30">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-[#008751] text-white rounded-[24px] font-black text-sm uppercase tracking-[4px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login to Portal' : 'Create Account')}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black text-[#008751] uppercase tracking-widest hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already a member? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
