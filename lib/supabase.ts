import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured. Please check your environment variables.');
    throw new Error('Supabase credentials not configured. Please check your environment variables.');
  }

  try {
    return createClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw new Error('Failed to create Supabase client. Please check your environment variables.');
  }
}

export const supabase = createSupabaseClient();