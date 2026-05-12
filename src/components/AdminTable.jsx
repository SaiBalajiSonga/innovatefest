import { useState, useMemo } from 'react'

export default function AdminTable({ data, onToggleStatus, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'submitted_at', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // 1. Search Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter(item => 
      item.full_name.toLowerCase().includes(lowerSearch) ||
      item.email.toLowerCase().includes(lowerSearch) ||
      item.university.toLowerCase().includes(lowerSearch)
    )
  }, [data, searchTerm])

  // 2. Sort Logic
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        // Handle nulls
        if (aValue === null) return 1
        if (bValue === null) return -1

        // String comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [filteredData, sortConfig])

  // 3. Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage))
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  // Reset to page 1 if search changes
  useMemo(() => { setCurrentPage(1) }, [searchTerm])

  // Handle Sort Click
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Handle CSV Export
  const exportToCSV = () => {
    if (sortedData.length === 0) return

    // Get headers from first object
    const headers = Object.keys(sortedData[0])
    
    // Convert array of objects to CSV string
    const csvContent = [
      headers.join(','), // Header row
      ...sortedData.map(row => 
        headers.map(header => {
          let cell = row[header] === null ? '' : row[header]
          // Escape quotes and wrap in quotes if contains comma
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
            cell = `"${cell.replace(/"/g, '""')}"`
          }
          // Stringify arrays (like skills)
          if (Array.isArray(cell)) {
            cell = `"${cell.join('; ')}"`
          }
          return cell
        }).join(',')
      )
    ].join('\n')

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `innovatefest-registrations-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper for Sort Indicator
  const SortIcon = ({ columnKey }) => {
    const active = sortConfig.key === columnKey
    return (
      <svg 
        className={`w-3 h-3 ml-1 inline transition-colors ${active ? 'text-primary' : 'text-surface-border'}`} 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        {active && sortConfig.direction === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        )}
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="form-input text-sm py-2 pl-9"
            placeholder="Search name, email, university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-text-muted">
            {sortedData.length} records
          </span>
          <button onClick={exportToCSV} className="btn-secondary text-xs py-2 px-4">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Wrapper for Horizontal Scroll */}
      <div className="overflow-x-auto rounded-lg border border-surface-border bg-surface-1">
        <table className="min-w-full divide-y divide-surface-border">
          <thead>
            <tr className="border-b border-surface-border bg-surface-2">
              {['Full Name', 'Email', 'University', 'Status', 'Date', 'Actions'].map((header, i) => {
                // Map headers to object keys for sorting
                const keys = ['full_name', 'email', 'university', 'status', 'submitted_at', null]
                const key = keys[i]
                
                return (
                  <th 
                    key={header}
                    onClick={() => key ? requestSort(key) : null}
                    className={`px-4 py-3 text-left text-xs font-mono text-text-muted uppercase tracking-wider select-none whitespace-nowrap ${key ? 'cursor-pointer hover:text-text-primary transition-colors' : ''}`}
                  >
                    {header} {key && <SortIcon columnKey={key} />}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-sm text-text-muted">
                  No registrations found.
                </td>
              </tr>
            ) : (
              paginatedData.map((reg) => (
                <tr key={reg.id} className="hover:bg-surface-2/40 transition-colors duration-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">
                    {reg.full_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                    {reg.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                    {reg.university}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {reg.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono bg-emerald-950/60 border border-emerald-900/60 text-emerald-400">
                        <span className="w-1 h-1 rounded-sm bg-emerald-400" />Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono bg-amber-950/60 border border-amber-900/60 text-amber-400">
                        <span className="w-1 h-1 rounded-sm bg-amber-400" />Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(reg.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex gap-2">
                    {reg.status === 'pending' ? (
                      <button 
                        onClick={() => onToggleStatus(reg.id, reg.status)}
                        className="text-xs px-2.5 py-1 rounded-md border border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/60 transition-colors font-mono"
                      >
                        Approve
                      </button>
                    ) : (
                      <button 
                        onClick={() => onToggleStatus(reg.id, reg.status)}
                        className="text-xs px-2.5 py-1 rounded-md border border-amber-900/60 text-amber-400 hover:bg-amber-950/60 transition-colors font-mono"
                      >
                        Revert
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(reg.id)}
                      className="text-xs p-1.5 rounded-md border border-red-900/60 text-red-400 hover:bg-red-950/60 transition-colors"
                      title="Delete Registration"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-text-muted">
          Page <span className="text-text-primary">{currentPage}</span> of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  )
}
