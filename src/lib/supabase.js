import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Initializing client...');
console.log('[Supabase] URL present:', !!supabaseUrl);
console.log('[Supabase] URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING');
console.log('[Supabase] Anon key present:', !!supabaseAnonKey);
console.log('[Supabase] Anon key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] CRITICAL: Environment variables missing!');
  console.error('[Supabase] Please create a .env file with:');
  console.error('[Supabase] VITE_SUPABASE_URL=your_supabase_url');
  console.error('[Supabase] VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('[Supabase] URL:', supabaseUrl || 'MISSING');
  console.error('[Supabase] Key:', supabaseAnonKey ? '[REDACTED]' : 'MISSING');
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('[Supabase] Invalid URL format. Must start with https://');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable magic link detection
    flowType: 'pkce', // Use PKCE flow for better security
  },
});

console.log('[Supabase] Client initialized successfully');
console.log('[Supabase] Ready to authenticate');
