import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import AdminTable from '../components/AdminTable'

const ease = [0.22, 1, 0.36, 1]

export default function Admin() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading]         = useState(true)

  useEffect(() => {
    if (!authLoading && !session) navigate('/admin/login')
  }, [session, authLoading, navigate])

  useEffect(() => {
    if (!session) return
    const fetchRegistrations = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/registrations`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (!res.ok) throw new Error('Failed to load registrations');
        const data = await res.json();
        setRegistrations(data || []);
      } catch (error) {
        toast.error('Failed to load registrations');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, [session])

  useEffect(() => {
    if (!session) return
    const channel = supabase
      .channel('admin-registrations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registrations' }, (payload) => {
        setRegistrations(prev => [payload.new, ...prev])
        toast('New registration', { icon: '📋' })
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const toggleStatus = async (id, current) => {
    const next = current === 'pending' ? 'approved' : 'pending'
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: next } : r))
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status: next })
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success(`Marked as ${next}`)
    } catch (error) {
      toast.error('Update failed')
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: current } : r))
    }
  }

  const deleteRegistration = async (id) => {
    if (!window.confirm('Delete this registration? This cannot be undone.')) return
    const prev = [...registrations]
    setRegistrations(p => p.filter(r => r.id !== id))
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted')
    } catch (error) {
      toast.error('Delete failed')
      setRegistrations(prev)
    }
  }

  if (authLoading || !session) return null

  // ── Stats from in-memory data ──────────────────────────────────────────
  const total    = registrations.length
  const approved = registrations.filter(r => r.status === 'approved').length
  const pending  = total - approved

  const METRICS = [
    { label: 'Total', value: total },
    { label: 'Approved', value: approved, highlight: true },
    { label: 'Pending', value: pending },
  ]

  return (
    <div className="min-h-screen bg-surface">

      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-[13px] text-text-primary">
              Innovate<span className="text-indigo-400">Fest</span>
            </span>
            <span className="hidden sm:inline text-white/[0.12] text-xs">·</span>
            <span className="hidden sm:inline text-[13px] font-mono text-text-muted">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page heading + metrics */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.05 }}
        >
          <h1 className="font-display text-xl font-extrabold text-text-primary mb-1">
            Registrations
          </h1>
          <p className="text-[14px] text-text-muted font-mono mb-6">
            InnovateFest 2026 · May 25–27
          </p>

          {/* Metric chips */}
          <div className="flex flex-wrap gap-3">
            {METRICS.map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm ${
                  highlight
                    ? 'bg-indigo-500/[0.08] border-indigo-500/20 text-indigo-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-text-secondary'
                }`}
              >
                <span className="font-display font-bold text-base text-inherit leading-none">
                  {isLoading ? '—' : value}
                </span>
                <span className="text-[13px] font-mono opacity-70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.12 }}
          className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.02]"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-24 text-text-muted">
              <svg className="animate-spin h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="text-[13px] font-mono">Loading registrations…</span>
            </div>
          ) : (
            <AdminTable
              data={registrations}
              onToggleStatus={toggleStatus}
              onDelete={deleteRegistration}
            />
          )}
        </motion.div>

      </main>
    </div>
  )
}
