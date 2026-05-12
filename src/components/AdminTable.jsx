import { useState, useMemo, useEffect } from 'react'

const PER_PAGE = 15

function SortIcon({ active, dir }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`inline ml-1 transition-colors ${active ? 'text-indigo-400' : 'text-white/[0.18]'}`}
    >
      {active && dir === 'asc'
        ? <path d="M6 15l6-6 6 6"/>
        : <path d="M6 9l6 6 6-6"/>
      }
    </svg>
  )
}

export default function AdminTable({ data, onToggleStatus, onDelete }) {
  const [search,     setSearch]     = useState('')
  const [sort,       setSort]       = useState({ key: 'submitted_at', dir: 'desc' })
  const [page,       setPage]       = useState(1)

  // Reset page when search changes
  useEffect(() => { setPage(1) }, [search])

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q)
    )
  }, [data, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sort.key] ?? ''
      let bv = b[sort.key] ?? ''
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      return sort.dir === 'asc' ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0)
    })
  }, [filtered, sort])

  const totalPages  = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const pageData    = useMemo(() => sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE), [sorted, page])

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  const exportCSV = () => {
    if (!sorted.length) return
    const keys = Object.keys(sorted[0])
    const rows = sorted.map(r => keys.map(k => {
      let v = r[k] == null ? '' : Array.isArray(r[k]) ? r[k].join('; ') : String(r[k])
      return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v
    }).join(','))
    const csv  = [keys.join(','), ...rows].join('\n')
    const a    = Object.assign(document.createElement('a'), {
      href:     URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `registrations-${new Date().toISOString().slice(0,10)}.csv`,
    })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  // ── Column config ──────────────────────────────────────────────────────
  const COLS = [
    { label: 'Name',       key: 'full_name',    sortable: true },
    { label: 'Email',      key: 'email',         sortable: true },
    { label: 'College',    key: 'college',       sortable: true },
    { label: 'Year',       key: 'year_of_study', sortable: false },
    { label: 'Status',     key: 'status',        sortable: true },
    { label: 'Registered', key: 'submitted_at',  sortable: true },
    { label: '',           key: null,            sortable: false },
  ]

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3.5 border-b border-white/[0.06]">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, college…"
            className="form-input text-[13px] py-1.5 pl-8"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono text-text-muted whitespace-nowrap">
            {sorted.length} result{sorted.length !== 1 ? 's' : ''}
          </span>
          <button onClick={exportCSV} className="btn-secondary text-[12px] px-3 py-1.5 gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {COLS.map(({ label, key, sortable }) => (
                <th
                  key={label}
                  onClick={() => sortable && key && toggleSort(key)}
                  className={`px-4 py-3 text-left text-[11px] font-mono text-text-muted uppercase tracking-[0.12em] whitespace-nowrap select-none ${
                    sortable ? 'cursor-pointer hover:text-text-primary transition-colors' : ''
                  }`}
                >
                  {label}
                  {sortable && key && <SortIcon active={sort.key === key} dir={sort.dir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-[13px] text-text-muted">
                  {search ? 'No results match your search.' : 'No registrations yet.'}
                </td>
              </tr>
            ) : pageData.map(reg => (
              <tr
                key={reg.id}
                className="hover:bg-white/[0.025] transition-colors duration-100 group"
              >
                <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                  {reg.full_name}
                </td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                  {reg.email}
                </td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                  {reg.college}
                </td>
                <td className="px-4 py-3 text-text-muted font-mono whitespace-nowrap">
                  {reg.year_of_study}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {reg.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted font-mono text-[12px] whitespace-nowrap">
                  {new Date(reg.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {reg.status === 'pending' ? (
                      <button
                        onClick={() => onToggleStatus(reg.id, reg.status)}
                        className="text-[11px] font-mono px-2 py-1 rounded-md border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(reg.id, reg.status)}
                        className="text-[11px] font-mono px-2 py-1 rounded-md border border-amber-500/25 text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        Revert
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(reg.id)}
                      title="Delete"
                      className="p-1.5 rounded-md border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
        <span className="text-[12px] font-mono text-text-muted">
          Page <span className="text-text-primary">{page}</span> of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-[12px] px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-[12px] px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
