/**
 * src/pages/AdminLogin.jsx
 *
 * Admin authentication page. Uses supabase.auth.signInWithPassword().
 * On success, redirects to /admin. If already logged in, redirects immediately.
 *
 * COMMON MISTAKE: Don't store the password in state after successful login.
 * Supabase manages the JWT session in localStorage automatically.
 *
 * Security note: we don't expose WHICH credential is wrong (email vs password)
 * to prevent account enumeration attacks.
 */
import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import toast                   from 'react-hot-toast'

import { supabase } from '../lib/supabaseClient'
import { useAuth }  from '../hooks/useAuth'

export default function AdminLogin() {
  const navigate        = useNavigate()
  const { session, loading } = useAuth()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && session) navigate('/admin', { replace: true })
  }, [session, loading, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Both email and password are required.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        // Don't expose "Invalid login credentials" vs "User not found" — just show a generic message
        setError('Invalid email or password. Please try again.')
        return
      }

      toast.success('Welcome back, admin!')
      navigate('/admin', { replace: true })
    } catch (err) {
      setError('Something went wrong. Check your connection.')
      console.error('Admin login error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Show nothing while checking existing session to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-brand-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-brand-950 to-brand-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-800 border border-brand-600/40 mb-4 text-2xl">
            🔐
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">InnovateFest Dashboard</p>
        </div>

        {/* Form card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@innovatefest.com"
                autoComplete="email"
                required
                className="form-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="form-input"
              />
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          This page is for event administrators only.
        </p>
      </div>
    </main>
  )
}
