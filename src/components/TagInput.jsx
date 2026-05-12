import { useState } from 'react'

export default function TagInput({ tags, onChange, disabled }) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      
      const newTag = inputValue.trim()
      
      // Basic validation: not empty and not duplicate
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag])
      }
      
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove) => {
    if (disabled) return
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`form-input cursor-text flex flex-wrap gap-1.5 min-h-[44px] items-center ${disabled ? 'opacity-50' : ''}`}>
      
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="inline-flex items-center gap-1 bg-surface-3 border border-surface-border text-text-secondary text-xs px-2.5 py-1 rounded-md"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            disabled={disabled}
            className="text-text-muted hover:text-text-primary transition-colors ml-0.5 focus:outline-none"
            aria-label={`Remove ${tag} tag`}
          >
            ×
          </button>
        </span>
      ))}
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-sm py-0.5"
        placeholder={tags.length === 0 ? "e.g. React, Node.js, Design..." : "Add another..."}
      />
    </div>
  )
}
