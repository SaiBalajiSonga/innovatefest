/**
 * src/hooks/useAuth.js
 *
 * Custom hook that returns the current Supabase session and a loading flag.
 * WHY a hook: Centralises session fetching so Admin.jsx and AdminLogin.jsx
 * both get the same reactive session state without duplicating code.
 *
 * COMMON MISTAKE: Using getSession() once at mount and ignoring later changes.
 * onAuthStateChange() keeps the state in sync when the user logs in/out in
 * another tab or when the JWT token refreshes automatically.
 */
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAuth() {
  const [session, setSession]   = useState(undefined) // undefined = still loading
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    // 1. Get the initial session (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Subscribe to future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    // 3. Cleanup: unsubscribe when the component unmounts
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}
