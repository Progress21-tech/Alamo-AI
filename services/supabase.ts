
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// Validate URL format to prevent the library from throwing a hard error on initialization
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && url !== '__SUPABASE_URL__';
  } catch {
    return false;
  }
};

export const checkSupabaseConfig = () => {
  return isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== '__SUPABASE_ANON_KEY__';
};

// Initialize Supabase client only if config is valid, otherwise export a mock to prevent crashes
export const supabase = checkSupabaseConfig()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithPassword: async () => ({ error: new Error("Supabase not configured") }),
        signUp: async () => ({ error: new Error("Supabase not configured") }),
        signOut: async () => ({ error: null }),
      },
    } as any);
