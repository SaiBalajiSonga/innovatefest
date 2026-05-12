import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import useAuth from '../hooks/useAuth'

export default function AdminLogin() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Redirect to admin dashboard if already logged in
  if (!loading && session) {
    navigate('/admin')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      
      // on success, useAuth hook will catch the session change and redirect
    } catch (err) {
      setError(err.message || 'Invalid login credentials')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-display text-xl font-semibold text-text-primary mb-1">
            InnovateFest
          </div>
          <div className="text-xs font-mono text-text-muted">Admin Portal</div>
        </div>

        {/* Login Card */}
        <div className="card-elevated p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-950/60 border border-red-900/60 text-red-400 text-xs rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Admin Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="admin@innovatefest.com"
                disabled={isLoggingIn}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In'}
            </button>
            
          </form>
        </div>
        
        <p className="text-xs font-mono text-text-muted text-center mt-4">
          Authorized personnel only.
        </p>
      </div>
    </main>
  )
}
