
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://yzlndhdmrxsyhcldcgyd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bG5kaGRtcnhzeWhjbGRjZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzQ0ODksImV4cCI6MjA4NTYxMDQ4OX0.SagAsld0tIu0qsoWA_QcRNbtsAXeBlO7KuoM3IxMub4';

// Validate URL format to prevent the library from throwing a hard error on initialization
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && url !== '__SUPABASE_URL__';
  } catch {
    return false;
  }
};

export const checkSupabaseConfig = () => {
  const isUrlValid = isValidUrl(supabaseUrl);
  const isKeyValid = supabaseAnonKey && supabaseAnonKey !== '__SUPABASE_ANON_KEY__';
  
  if (!isUrlValid || !isKeyValid) {
    console.warn("ALÁMÒ CONFIG WARNING: Supabase credentials missing or default placeholders found in index.html.");
  }
  
  return isUrlValid && isKeyValid;
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
        signInWithPassword: async () => ({ error: new Error("Supabase is not configured yet. Check index.html.") }),
        signUp: async () => ({ error: new Error("Supabase is not configured yet. Check index.html.") }),
        signOut: async () => ({ error: null }),
      },
    } as any);
