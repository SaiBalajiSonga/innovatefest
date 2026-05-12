/**
 * src/pages/Admin.jsx
 *
 * Protected admin dashboard.
 * Uses useAuth to redirect unauthenticated users to /admin/login.
 * Fetches all registrations on mount, subscribes to realtime INSERTs,
 * and passes data down to AdminTable.jsx for rendering.
 *
 * WHY handle data here instead of in AdminTable:
 * Separation of concerns. Admin.jsx handles the data layer (fetch, realtime, mutations),
 * while AdminTable is purely a dumb presentation component. This makes testing easier.
 *
 * COMMON MISTAKE: Forgetting to clean up the realtime subscription on unmount,
 * which causes memory leaks and duplicate events if the user navigates away and back.
 */
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { supabase } from '../lib/supabaseClient'
import { useAuth }  from '../hooks/useAuth'
import AdminTable   from '../components/AdminTable'

export default function Admin() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()

  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)

  // ── 1. AUTH GUARD ──
  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/login', { replace: true })
    }
  }, [session, authLoading, navigate])

  // ── 2. DATA FETCHING ──
  const fetchRegistrations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(500)

      if (error) throw error
      setRegistrations(data || [])
    } catch (err) {
      toast.error('Failed to load registrations.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Mount effect: fetch initial data and subscribe to Realtime
  useEffect(() => {
    if (authLoading || !session) return // wait until authenticated

    fetchRegistrations()

    // Subscribe to new registrations (INSERT only)
    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registrations' },
        (payload) => {
          // Add the new row to the top of the local state
          setRegistrations(prev => [payload.new, ...prev])
          toast('New registration received!', { icon: '🔔' })
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [authLoading, session, fetchRegistrations])

  // ── 3. MUTATIONS ──

  // Toggle status (pending <-> approved)
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'

    // Optimistic update for immediate UI feedback
    setRegistrations(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    )

    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      // Revert optimistic update on failure
      setRegistrations(prev =>
        prev.map(r => r.id === id ? { ...r, status: currentStatus } : r)
      )
      toast.error('Failed to update status.')
      console.error('Update error:', err)
    }
  }

  // Delete registration
  const handleDelete = async (id) => {
    // Optimistic remove
    const previous = [...registrations]
    setRegistrations(prev => prev.filter(r => r.id !== id))

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Registration deleted')
    } catch (err) {
      // Revert
      setRegistrations(previous)
      toast.error('Failed to delete registration.')
      console.error('Delete error:', err)
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  // ── 4. RENDER ──
  if (authLoading || !session) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-brand-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 border-b border-white/10">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage InnovateFest registrations</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm px-4 py-2"
          >
            Sign Out
          </button>
        </header>

        {/* Content area */}
        <div className="glass-card p-4 sm:p-6 shadow-2xl">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-brand-400">
              <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading registrations…
            </div>
          ) : (
            <AdminTable
              rows={registrations}
              onStatusToggle={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </main>
  )
}
