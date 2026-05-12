import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import AdminTable from '../components/AdminTable'

export default function Admin() {
  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin/login')
    }
  }, [session, authLoading, navigate])

  // Fetch initial data
  useEffect(() => {
    if (!session) return

    const fetchRegistrations = async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(500)

      if (error) throw error
      setRegistrations(data || [])
      setIsLoading(false)
    }

    fetchRegistrations().catch(err => {
      console.error(err)
      toast.error('Failed to load registrations')
      setIsLoading(false)
    })
  }, [session])

  // Subscribe to real-time inserts
  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registrations' },
        (payload) => {
          // Optimistically add new registration to the top of the list
          setRegistrations((prev) => [payload.new, ...prev])
          toast('New registration received', { icon: null })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  // Handle Status Toggle (Approve / Pending)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'approved' : 'pending'
    
    // Optimistic UI update
    setRegistrations(prev => 
      prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg)
    )

    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      toast.success(`Applicant marked as ${newStatus}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status')
      // Revert optimistic update on failure
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: currentStatus } : reg)
      )
    }
  }

  // Handle Deletion
  const deleteRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration? This cannot be undone.')) return

    // Optimistic UI update
    const previousState = [...registrations]
    setRegistrations(prev => prev.filter(reg => reg.id !== id))

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Registration deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete registration')
      // Revert optimistic update
      setRegistrations(previousState)
    }
  }

  // Show nothing while checking auth session
  if (authLoading || !session) return null

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              InnovateFest 2026 · Registration Management
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2">
            Sign Out
          </button>
        </header>

        {/* Main Content Area */}
        <main className="card p-5 overflow-hidden">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center gap-3 text-text-muted">
              <div className="w-5 h-5 border border-surface-border border-t-primary rounded-full animate-spin" />
              <span className="text-xs font-mono">Loading registrations...</span>
            </div>
          ) : (
            <AdminTable 
              data={registrations} 
              onToggleStatus={toggleStatus}
              onDelete={deleteRegistration}
            />
          )}
        </main>
        
      </div>
    </div>
  )
}
