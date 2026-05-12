export default function TagInput({ tags, onChange, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = e.target.value.trim()
      if (tag && !tags.includes(tag)) onChange([...tags, tag])
      e.target.value = ''
    } else if (e.key === 'Backspace' && !e.target.value && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div
      className={`form-input flex flex-wrap gap-1.5 min-h-[42px] items-center cursor-text ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono px-2 py-0.5 rounded-md"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
            className="text-indigo-400/60 hover:text-indigo-300 transition-colors leading-none focus:outline-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-sm py-0.5"
        placeholder={tags.length === 0 ? 'React, Python, Design…' : 'Add more…'}
      />
    </div>
  )
}
