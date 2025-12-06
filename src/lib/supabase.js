import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zjxffkulsznxkjxvmxrk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have valid credentials
export const hasValidCredentials = Boolean(supabaseUrl && supabaseAnonKey)

if (!hasValidCredentials) {
  console.warn('Missing Supabase anon key. Please add VITE_SUPABASE_ANON_KEY to your .env file.')
}

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
