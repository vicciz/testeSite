import { createClient } from '@supabase/supabase-js'

// read from environment so the project works both locally and on Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with fallback for build time
// During Vercel build, if env vars aren't set, create a dummy client
// At runtime, the real env vars will be available
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)