/**
 * src/components/TagInput.jsx
 *
 * Reusable tag/chip input component.
 * Users type a skill and press Enter or comma to add it as a tag.
 * Press Backspace on an empty input to delete the last tag.
 *
 * WHY a separate component: the tag logic (state, keyboard handling, deduplication)
 * is complex enough to isolate. RegistrationForm stays clean.
 *
 * Props:
 *   tags     {string[]} — current list of tags (controlled)
 *   onChange {function} — called with the new tags array whenever it changes
 *
 * COMMON MISTAKE: Don't mutate the `tags` prop directly. Always call onChange
 * with a new array (immutable update pattern).
 */
import { useState, useRef } from 'react'

export default function TagInput({ tags, onChange }) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  // Add a tag: trim whitespace, deduplicate, enforce 20-tag max
  const addTag = (raw) => {
    const value = raw.trim().toLowerCase()
    if (!value) return
    if (tags.includes(value)) return       // skip duplicates
    if (tags.length >= 20) return          // safety cap
    onChange([...tags, value])
  }

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, i) => i !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    // Enter or comma → add tag
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault() // prevent form submission on Enter
      addTag(inputValue)
      setInputValue('')
    }
    // Backspace on empty input → delete last tag
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleBlur = () => {
    // Auto-add any typed value when focus leaves the input
    if (inputValue.trim()) {
      addTag(inputValue)
      setInputValue('')
    }
  }

  return (
    // Clicking anywhere in the container focuses the hidden input
    <div
      onClick={() => inputRef.current?.focus()}
      className="form-input cursor-text flex flex-wrap gap-2 min-h-[3rem] items-center"
    >
      {/* Render existing tags */}
      {tags.map((tag, idx) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-brand-600/40 border border-brand-500/50 text-brand-200 text-sm px-2.5 py-0.5 rounded-lg"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation() // don't re-focus the input
              removeTag(idx)
            }}
            aria-label={`Remove ${tag}`}
            className="text-brand-400 hover:text-white transition-colors ml-0.5 focus:outline-none"
          >
            ×
          </button>
        </span>
      ))}

      {/* Text input — visually hidden inside the tag container */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? 'e.g. React, Python, Figma… (press Enter)' : ''}
        className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 text-sm py-0.5"
        aria-label="Add a skill tag"
      />
    </div>
  )
}
