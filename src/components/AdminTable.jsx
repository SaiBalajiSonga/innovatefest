/**
 * src/components/AdminTable.jsx
 *
 * Displays paginated registrations with search, sort, status toggle, delete, and CSV export.
 *
 * Props:
 *   rows         {object[]} — all registrations fetched from Supabase
 *   onStatusToggle {function(id, currentStatus)} — called to flip pending↔approved
 *   onDelete       {function(id)}                — called to delete a row
 *
 * WHY client-side search + sort: for a hackathon with ~500 registrations this is fine.
 * Server-side filtering (via Supabase .filter()) is more appropriate at 10k+ rows
 * and can be swapped in by changing the fetch in Admin.jsx.
 *
 * WHY client-side CSV: avoids a backend endpoint. Fine for this scale. Just stringify
 * the data and trigger a download via a Blob URL.
 *
 * Pagination: slices the filtered array — no extra fetch needed.
 */
import { useState, useMemo } from 'react'

const PAGE_SIZE = 10

// ── CSV EXPORT ─────────────────────────────────────────────────────────────
function exportToCSV(rows) {
  const headers = ['ID', 'Name', 'Email', 'College', 'Year', 'Skills', 'Motivation', 'Status', 'Submitted At']
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

  const lines = [
    headers.join(','),
    ...rows.map(r => [
      escape(r.id),
      escape(r.full_name),
      escape(r.email),
      escape(r.college),
      escape(r.year_of_study),
      escape((r.skills ?? []).join('; ')),
      escape(r.motivation),
      escape(r.status),
      escape(new Date(r.submitted_at).toLocaleString()),
    ].join(',')),
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `innovatefest-registrations-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ── STATUS BADGE ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const base = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold'
  return status === 'approved' ? (
    <span className={`${base} bg-green-500/20 text-green-400 border border-green-500/30`}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />Approved
    </span>
  ) : (
    <span className={`${base} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}>
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />Pending
    </span>
  )
}

// ── SORT ICON ──────────────────────────────────────────────────────────────
function SortIcon({ active, asc }) {
  return (
    <svg className={`w-3.5 h-3.5 ml-1 inline ${active ? 'text-brand-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {asc
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      }
    </svg>
  )
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function AdminTable({ rows, onStatusToggle, onDelete }) {
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState('submitted_at')
  const [sortAsc, setSortAsc]   = useState(false)
  const [page, setPage]         = useState(1)
  // Track which row is awaiting deletion confirmation
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Toggle sort column; if same column, flip direction
  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(prev => !prev)
    else { setSortKey(key); setSortAsc(true) }
    setPage(1) // reset to page 1 on re-sort
  }

  // Derived: filter then sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return rows
      .filter(r =>
        !q ||
        r.full_name.toLowerCase().includes(q) ||
        r.college.toLowerCase().includes(q)  ||
        (r.skills ?? []).some(s => s.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        let valA = a[sortKey]
        let valB = b[sortKey]
        // Dates: compare as timestamps
        if (sortKey === 'submitted_at') { valA = new Date(valA); valB = new Date(valB) }
        if (valA < valB) return sortAsc ? -1 : 1
        if (valA > valB) return sortAsc ?  1 : -1
        return 0
      })
  }, [rows, search, sortKey, sortAsc])

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1) // reset page on new search
  }

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="admin-search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, college, or skill…"
            className="form-input pl-9 py-2 text-sm"
          />
        </div>

        {/* Count + export */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">
            <span className="text-white font-bold">{filtered.length}</span>
            {' '}of{' '}
            <span className="text-white font-bold">{rows.length}</span>
            {' '}registrations
          </span>
          <button
            id="admin-export-btn"
            onClick={() => exportToCSV(filtered)}
            className="btn-secondary text-sm py-2 px-4"
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-brand-900/40">
              {/* Sortable headers */}
              {[
                { label: 'Name',    key: 'full_name'     },
                { label: 'Email',   key: 'email'         },
                { label: 'College', key: 'college'       },
                { label: 'Year',    key: 'year_of_study' },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-brand-300 transition-colors select-none whitespace-nowrap"
                >
                  {label}
                  <SortIcon active={sortKey === key} asc={sortAsc} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th
                onClick={() => handleSort('submitted_at')}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-brand-300 transition-colors select-none whitespace-nowrap"
              >
                Date
                <SortIcon active={sortKey === 'submitted_at'} asc={sortAsc} />
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  {search ? 'No registrations match your search.' : 'No registrations yet.'}
                </td>
              </tr>
            ) : (
              currentRows.map(row => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors duration-150">
                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{row.full_name}</td>

                  {/* Email */}
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    <a href={`mailto:${row.email}`} className="hover:text-brand-300 transition-colors">{row.email}</a>
                  </td>

                  {/* College */}
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap max-w-[160px] truncate" title={row.college}>
                    {row.college}
                  </td>

                  {/* Year */}
                  <td className="px-4 py-3 text-center text-slate-300">{row.year_of_study}</td>

                  {/* Skills */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {(row.skills ?? []).slice(0, 4).map(s => (
                        <span key={s} className="bg-brand-800/60 text-brand-300 text-xs px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                      {(row.skills ?? []).length > 4 && (
                        <span className="text-slate-500 text-xs">+{row.skills.length - 4}</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>

                  {/* Date */}
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(row.submitted_at).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Toggle status */}
                      <button
                        onClick={() => onStatusToggle(row.id, row.status)}
                        title={row.status === 'approved' ? 'Mark as Pending' : 'Approve'}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 font-medium whitespace-nowrap ${
                          row.status === 'approved'
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                            : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                        }`}
                      >
                        {row.status === 'approved' ? '↩ Pending' : '✓ Approve'}
                      </button>

                      {/* Delete */}
                      {confirmDelete === row.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { onDelete(row.id); setConfirmDelete(null) }}
                            className="btn-danger"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs px-2 py-1.5 text-slate-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(row.id)}
                          className="btn-danger"
                          title="Delete registration"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            id="admin-prev-page"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-sm py-1.5 px-4 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-slate-400 text-sm">
            Page <span className="text-white font-semibold">{page}</span> of <span className="text-white font-semibold">{totalPages}</span>
          </span>
          <button
            id="admin-next-page"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-sm py-1.5 px-4 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
