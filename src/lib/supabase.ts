import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided by user
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://syfhohnpvjqfloxhbqwz.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5ZmhvaG5wdmpxZmxveGhicXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTE0NzAsImV4cCI6MjEwNTMyNzQ3MH0.aMi69D25yh2I8y0yLMl3Wjhxo4Y5bYhEDtQuE7Mjl4w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_PROJECT_ID = 'syfhohnpvjqfloxhbqwz';
export const SUPABASE_DATA_API_URL = 'https://syfhohnpvjqfloxhbqwz.supabase.co/rest/v1/';
