import { useState, useMemo, useEffect, useCallback, useRef } from 'react'

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso)
  const h = Math.floor(diff / 36e5)
  if (h < 1)  return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return formatDate(iso)
}

// ── Icons ──────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
)
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconFilter = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)
const IconX = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconLayoutCompact = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="4" rx="1"/><rect x="3" y="11" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/>
  </svg>
)
const IconLayoutExpanded = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="8" rx="1"/><rect x="3" y="13" width="18" height="8" rx="1"/>
  </svg>
)

// ── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status, size = 'sm' }) {
  const cls = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[11px]'
  if (status === 'approved')
    return <span className={`inline-flex items-center gap-1.5 rounded-md font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 ${cls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />Approved
      </span>
  if (status === 'rejected')
    return <span className={`inline-flex items-center gap-1.5 rounded-md font-mono bg-red-500/10 border border-red-500/20 text-red-400 ${cls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />Rejected
      </span>
  return <span className={`inline-flex items-center gap-1.5 rounded-md font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />Pending
    </span>
}

// ── Compact native select styled for dark theme ────────────────────────────

function FilterSelect({ value, onChange, children, title }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      title={title}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[12px] font-mono text-text-secondary focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 appearance-none cursor-pointer truncate"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2352525b' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
    >
      {children}
    </select>
  )
}

// ── Skill autocomplete combobox ────────────────────────────────────────────

function SkillCombobox({ value, onChange, allSkills }) {
  const [open, setOpen]               = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef                  = useRef(null)

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return allSkills.slice(0, 30)
    return allSkills.filter(s => s.toLowerCase().includes(q)).slice(0, 20)
  }, [value, allSkills])

  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  function handleKeyDown(e) {
    if (!open) { if (e.key === 'ArrowDown') { e.stopPropagation(); setOpen(true) }; return }
    e.stopPropagation()
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && suggestions[highlighted]) { onChange(suggestions[highlighted]); setOpen(false); setHighlighted(-1) }
      else setOpen(false)
    }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); setHighlighted(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Filter by skill (e.g. React)\u2026"
          className="form-input text-[12px] py-1.5 w-full font-mono pr-7"
        />
        {value && (
          <button
            type="button" tabIndex={-1}
            onClick={() => { onChange(''); setOpen(false) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <IconX />
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-44 overflow-y-auto bg-[#111118] border border-white/[0.10] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-1">
          {suggestions.map((s, i) => {
            const idx = s.toLowerCase().indexOf(value.toLowerCase())
            return (
              <li
                key={s}
                onMouseDown={() => { onChange(s); setOpen(false); setHighlighted(-1) }}
                onMouseEnter={() => setHighlighted(i)}
                className={`px-3 py-1.5 text-[12px] font-mono cursor-pointer transition-colors flex items-center gap-2 ${
                  highlighted === i ? 'bg-indigo-600/25 text-indigo-200' : 'text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 shrink-0" />
                {value.trim() && idx !== -1 ? (
                  <>
                    {s.slice(0, idx)}
                    <span className="text-indigo-300 font-semibold">{s.slice(idx, idx + value.length)}</span>
                    {s.slice(idx + value.length)}
                  </>
                ) : s}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Registration Card (left panel) ────────────────────────────────────────

function RegCard({ reg, isSelected, onClick, cardMode }) {
  const skills   = Array.isArray(reg.skills) ? reg.skills : []
  const shown    = skills.slice(0, 3)
  const extra    = skills.length - shown.length
  const expanded = cardMode === 'expanded' || isSelected

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left px-4 py-2.5 border-b border-white/[0.05] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 ${
        isSelected
          ? 'bg-indigo-500/[0.10] border-l-2 border-l-indigo-500 pl-[14px]'
          : 'hover:bg-white/[0.035] border-l-2 border-l-transparent'
      }`}
    >
      {/* Always visible: Name + status */}
      <div className="flex items-center justify-between gap-2">
        <span className={`font-semibold text-[14px] leading-tight truncate transition-colors duration-150 ${
          isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
        }`}>
          {reg.full_name}
        </span>
        <StatusBadge status={reg.status} />
      </div>

      {/* Details — shown always in expanded mode, or when card is selected */}
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
        expanded ? 'max-h-44 opacity-100 mt-2.5' : 'max-h-0 opacity-0'
      }`}>
        <p className="text-[12px] text-indigo-300/60 font-mono truncate mb-1.5">{reg.email}</p>
        <p className="text-[12px] text-text-muted truncate mb-2" title={reg.college}>
          {reg.college || '—'}
        </p>
        <div className="flex items-center justify-between gap-2 mb-2">
          {reg.year_of_study
            ? <span className="text-[11px] font-mono text-text-muted bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded">{reg.year_of_study}</span>
            : <span />
          }
          <span className="text-[11px] font-mono text-text-muted">{relativeTime(reg.submitted_at)}</span>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {shown.map((s, i) => (
              <span key={i} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 leading-tight">{s}</span>
            ))}
            {extra > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-text-muted leading-tight">+{extra} more</span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

// ── Detail View (right panel) ─────────────────────────────────────────────

function DetailView({ reg, onUpdateStatus, onDelete }) {
  if (!reg) return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 select-none">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4 text-text-muted text-lg">→</div>
      <p className="text-[13px] text-text-secondary font-medium mb-1">Select a registration</p>
      <p className="text-[13px] text-text-muted">Click any card on the left to view full details</p>
      <p className="text-[12px] font-mono text-text-muted mt-3 opacity-60">↑ ↓ arrow keys to navigate</p>
    </div>
  )

  const skills     = Array.isArray(reg.skills) ? reg.skills : []
  const isPending  = reg.status === 'pending'
  const isApproved = reg.status === 'approved'
  const isRejected = reg.status === 'rejected'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-7 py-5 border-b border-white/[0.07] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-[18px] text-text-primary leading-tight mb-0.5">{reg.full_name}</h2>
            <p className="text-[14px] text-indigo-300/80 font-mono">{reg.email}</p>
          </div>
          <StatusBadge status={reg.status} size="lg" />
        </div>
        <p className="text-[12px] font-mono text-text-muted mt-2.5">
          Registered · {formatDate(reg.submitted_at)} · {relativeTime(reg.submitted_at)}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock label="College / University" value={reg.college} />
          <InfoBlock label="Year of Study"        value={reg.year_of_study} />
        </div>

        <div>
          <SectionLabel>Skills &amp; Interests</SectionLabel>
          {skills.length > 0
            ? <div className="flex flex-wrap gap-2 mt-2.5">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg text-[12px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">{s}</span>
                ))}
              </div>
            : <p className="mt-2.5 text-[13px] text-text-muted italic">No skills listed</p>
          }
        </div>

        <div>
          <SectionLabel>Motivation Statement</SectionLabel>
          <div className="mt-2.5 bg-white/[0.025] border border-white/[0.07] rounded-xl p-5">
            {reg.motivation
              ? <p className="text-[14px] text-text-secondary leading-[1.75] whitespace-pre-wrap">{reg.motivation}</p>
              : <p className="text-[14px] text-text-muted italic">Not provided</p>
            }
          </div>
          {reg.motivation && (
            <p className="text-[12px] font-mono text-text-muted mt-1.5 text-right">{reg.motivation.length} characters</p>
          )}
        </div>
      </div>

      {/* Footer — approve / reject / revert + delete */}
      <div className="px-7 py-4 border-t border-white/[0.07] shrink-0 flex gap-2">
        {/* Approve */}
        {!isApproved && (
          <button
            onClick={() => onUpdateStatus(reg.id, 'approved')}
            className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[13px] font-semibold border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98] transition-all duration-150"
          >
            <IconCheck /> Approve
          </button>
        )}
        {/* Reject */}
        {!isRejected && (
          <button
            onClick={() => onUpdateStatus(reg.id, 'rejected')}
            className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-[13px] font-semibold border border-red-500/25 text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150"
          >
            <IconX /> Reject
          </button>
        )}
        {/* Revert to pending */}
        {(isApproved || isRejected) && (
          <button
            onClick={() => onUpdateStatus(reg.id, 'pending')}
            className="flex items-center gap-1.5 justify-center py-2.5 px-3 rounded-xl text-[13px] font-semibold border border-amber-500/25 text-amber-400 hover:bg-amber-500/10 active:scale-[0.98] transition-all duration-150"
          >
            ↺ Pending
          </button>
        )}
        {/* Delete */}
        <button
          onClick={() => onDelete(reg.id)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold border border-white/[0.08] text-text-muted hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/[0.07] active:scale-[0.98] transition-all duration-150"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return <p className="text-[12px] font-mono text-text-muted uppercase tracking-[0.14em]">{children}</p>
}

function InfoBlock({ label, value }) {
  return (
    <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3">
      <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[14px] text-text-secondary font-medium leading-snug">{value || '—'}</p>
    </div>
  )
}

// ── Active filter chip ─────────────────────────────────────────────────────

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors"><IconX /></button>
    </span>
  )
}

// ── Main Export ────────────────────────────────────────────────────────────

export default function AdminTable({ data, onUpdateStatus, onDelete }) {
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [collegeFilter, setCollegeFilter] = useState('')
  const [yearFilter,    setYearFilter]    = useState('')
  const [skillFilter,   setSkillFilter]   = useState('')
  const [selected,      setSelected]      = useState(null)
  const [showFilters,   setShowFilters]   = useState(false)
  const [cardMode,      setCardMode]      = useState('compact') // 'compact' | 'expanded'

  // Unique options derived from data
  const colleges  = useMemo(() => [...new Set(data.map(r => r.college).filter(Boolean))].sort(), [data])
  const years     = useMemo(() => [...new Set(data.map(r => r.year_of_study).filter(Boolean))].sort(), [data])
  const allSkills = useMemo(() => {
    const set = new Set()
    data.forEach(r => r.skills?.forEach(s => set.add(s)))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [data])

  // Keep selected in sync after data updates
  useEffect(() => {
    if (selected) setSelected(data.find(r => r.id === selected.id) || null)
  }, [data])

  const handleDelete = useCallback(async (id) => {
    await onDelete(id)
    setSelected(prev => prev?.id === id ? null : prev)
  }, [onDelete])

  // Filtering
  const filtered = useMemo(() => {
    return data
      .filter(r => {
        const q = search.trim().toLowerCase()
        if (q && !(
          r.full_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.college?.toLowerCase().includes(q) ||
          r.skills?.some(s => s.toLowerCase().includes(q))
        )) return false
        if (statusFilter !== 'all' && r.status !== statusFilter) return false
        if (collegeFilter && r.college !== collegeFilter) return false
        if (yearFilter    && r.year_of_study !== yearFilter) return false
        if (skillFilter.trim() && !r.skills?.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))) return false
        return true
      })
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
  }, [data, search, statusFilter, collegeFilter, yearFilter, skillFilter])

  // Count active filters (excluding search & status)
  const activeFilterCount = [collegeFilter, yearFilter, skillFilter.trim()].filter(Boolean).length

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return
      e.preventDefault()
      const idx = selected ? filtered.findIndex(r => r.id === selected.id) : -1
      if (e.key === 'ArrowDown') setSelected(filtered[Math.min(idx + 1, filtered.length - 1)] ?? filtered[0] ?? null)
      if (e.key === 'ArrowUp'  ) setSelected(filtered[Math.max(idx - 1, 0)] ?? null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, filtered])

  // Stats
  const total    = data.length
  const approved = data.filter(r => r.status === 'approved').length
  const rejected = data.filter(r => r.status === 'rejected').length
  const pending  = total - approved - rejected

  // CSV Export
  const exportCSV = () => {
    if (!filtered.length) return
    const keys   = ['full_name', 'email', 'college', 'year_of_study', 'skills', 'motivation', 'status', 'submitted_at']
    const header = ['Name', 'Email', 'College', 'Year', 'Skills', 'Motivation', 'Status', 'Registered']
    const rows   = filtered.map(r => keys.map(k => {
      let v = r[k] == null ? '' : Array.isArray(r[k]) ? r[k].join('; ') : String(r[k])
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g,'""')}"` : v
    }).join(','))
    const csv = [header.join(','), ...rows].join('\n')
    const a   = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `registrations-${new Date().toISOString().slice(0,10)}.csv`,
    })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  const clearAllFilters = () => {
    setSearch(''); setStatusFilter('all')
    setCollegeFilter(''); setYearFilter(''); setSkillFilter('')
  }
  const anyActive = search || statusFilter !== 'all' || activeFilterCount > 0

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[560px]">

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div className="w-[310px] shrink-0 flex flex-col border-r border-white/[0.07]">

        {/* Search bar */}
        <div className="px-3 pt-3 pb-2 border-b border-white/[0.06] space-y-2 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><IconSearch /></span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, college, skill…"
              className="form-input text-[13px] py-2 pl-8 w-full"
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-1.5">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s} onClick={() => setStatusFilter(s)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-mono transition-all capitalize ${
                  statusFilter === s
                    ? s === 'approved' ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                    : s === 'rejected' ? 'bg-red-500/15 border border-red-500/25 text-red-400'
                    : s === 'pending'  ? 'bg-amber-500/15 border border-amber-500/25 text-amber-400'
                    : 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-300'
                    : 'bg-white/[0.03] border border-white/[0.07] text-text-muted hover:text-text-secondary'
                }`}
              >{s}</button>
            ))}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-[12px] font-mono transition-colors border ${
              showFilters || activeFilterCount > 0
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                : 'bg-white/[0.03] border-white/[0.07] text-text-muted hover:text-text-secondary'
            }`}
          >
            <IconFilter />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-auto bg-indigo-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <span className={`ml-auto text-[10px] transition-transform duration-150 ${activeFilterCount > 0 ? 'mr-5' : ''} ${showFilters ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {/* Filter panel */}
          {showFilters && (
            <div className="space-y-2 pt-1 pb-1">
              <FilterSelect value={collegeFilter} onChange={setCollegeFilter} title="Filter by college">
                <option value="">All Colleges</option>
                {colleges.map(c => <option key={c} value={c}>{c}</option>)}
              </FilterSelect>

              <FilterSelect value={yearFilter} onChange={setYearFilter} title="Filter by year">
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </FilterSelect>

              <SkillCombobox
                value={skillFilter}
                onChange={setSkillFilter}
                allSkills={allSkills}
              />
            </div>
          )}

          {/* Active filter chips */}
          {(collegeFilter || yearFilter || skillFilter) && (
            <div className="flex flex-wrap gap-1 pb-1">
              {collegeFilter && <FilterChip label={collegeFilter.length > 18 ? collegeFilter.slice(0,18)+'…' : collegeFilter} onRemove={() => setCollegeFilter('')} />}
              {yearFilter    && <FilterChip label={yearFilter}    onRemove={() => setYearFilter('')} />}
              {skillFilter   && <FilterChip label={`skill: ${skillFilter}`} onRemove={() => setSkillFilter('')} />}
            </div>
          )}

          {/* Stats + card mode toggle row */}
          <div className="flex items-center gap-2 px-0.5">
            <span className="text-[12px] font-mono text-text-muted">{total} total</span>
            <span className="text-white/10">·</span>
            <span className="text-[12px] font-mono text-emerald-500">{approved} ✓</span>
            <span className="text-white/10">·</span>
            <span className="text-[12px] font-mono text-amber-500">{pending} pending</span>
            <span className="text-white/10">·</span>
            <span className="text-[12px] font-mono text-red-400">{rejected} ✗</span>

            <div className="ml-auto flex items-center gap-1">
              {/* Card view mode toggle */}
              <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
                <button
                  onClick={() => setCardMode('compact')}
                  title="Compact cards"
                  className={`p-1.5 transition-colors ${
                    cardMode === 'compact'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.05]'
                  }`}
                >
                  <IconLayoutCompact />
                </button>
                <button
                  onClick={() => setCardMode('expanded')}
                  title="Detailed cards"
                  className={`p-1.5 transition-colors border-l border-white/[0.08] ${
                    cardMode === 'expanded'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.05]'
                  }`}
                >
                  <IconLayoutExpanded />
                </button>
              </div>

              <button onClick={exportCSV} title="Export CSV" className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors">
                <IconDownload />
              </button>
              {anyActive && (
                <button onClick={clearAllFilters} title="Clear all filters" className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.07] transition-colors">
                  <IconX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0
            ? <div className="flex flex-col items-center justify-center h-40 gap-2">
                <p className="text-[13px] text-text-muted">No registrations match</p>
                <button onClick={clearAllFilters} className="text-[12px] font-mono text-indigo-400 hover:underline">Clear filters</button>
              </div>
            : filtered.map(reg => (
                <RegCard
                  key={reg.id} reg={reg}
                  isSelected={selected?.id === reg.id}
                  onClick={() => setSelected(reg)}
                  cardMode={cardMode}
                />
              ))
          }
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] shrink-0">
          <p className="text-[12px] font-mono text-text-muted">
            {filtered.length} shown · ↑↓ navigate
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <DetailView reg={selected} onUpdateStatus={onUpdateStatus} onDelete={handleDelete} />
      </div>
    </div>
  )
}
