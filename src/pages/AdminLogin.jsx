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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]         = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  if (!loading && session) {
    navigate('/admin')
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

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
                disabled={isLoggingIn}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input pr-10"
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
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
