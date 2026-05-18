import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

const ease = [0.22, 1, 0.36, 1]

export default function AdminLogin() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  if (!loading && session) {
    navigate('/admin')
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">

      {/* Top glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[240px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.07) 0%, transparent 65%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10 w-full max-w-[380px]"
      >

        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-display font-bold text-[13px] text-text-primary mb-1">
            Innovate<span className="text-indigo-400">Fest</span>
          </p>
          <p className="text-[12px] font-mono text-text-muted uppercase tracking-[0.16em]">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="card-elevated px-6 py-7">

          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-lg px-3.5 py-3 mb-5">
              <svg className="flex-shrink-0 mt-0.5 text-red-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[13px] text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="label">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="admin@innovatefest.com"
                disabled={isLoggingIn}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
                disabled={isLoggingIn}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full py-2.5 text-[13px] mt-1"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Verifying…
                </>
              ) : 'Sign in'}
            </button>
          </form>

        </div>

        <p className="text-center text-[12px] font-mono text-text-muted mt-4">
          Authorized personnel only.
        </p>

      </motion.div>
    </main>
  )
}
