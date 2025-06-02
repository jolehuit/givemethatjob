import { createBrowserClient } from '@supabase/ssr'
import { Database } from './supabase-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured. Please check your environment variables.');
    return null;
  }

  try {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

export const supabase = getSupabaseClient();

export function createClient() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client could not be initialized. Please check your environment variables.');
  }
  return client;
}