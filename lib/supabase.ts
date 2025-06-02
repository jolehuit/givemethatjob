import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured');
    return null;
  }

  try {
    return createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    );
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

export const supabase = createClient() || createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);