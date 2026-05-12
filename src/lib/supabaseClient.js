/**
 * src/lib/supabaseClient.js
 *
 * Single shared Supabase client instance.
 * WHY a singleton: creating multiple clients wastes connections and can cause
 * auth state inconsistencies. Import `supabase` everywhere instead of calling createClient.
 *
 * COMMON MISTAKE: Forgetting the VITE_ prefix on env vars.
 * Vite only exposes env vars prefixed with VITE_ to the browser bundle.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail fast during development if env vars are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
