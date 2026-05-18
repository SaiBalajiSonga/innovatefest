import { useState, useRef, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import TagInput from './TagInput'

import {
  COLLEGES,
} from '../lib/formOptions'

const YEARS_OF_STUDY = [
  'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'PhD / Research'
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Sub-components ─────────────────────────────────────────────────────────

/** Inline label with optional required star */
function FieldLabel({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="label flex items-center gap-1 mb-2">
      {children}
      {required && (
        <span className="text-red-400 text-[10px] font-bold leading-none" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

/** Wrapper that handles error display */
function Field({ id, label, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-[12px] text-red-400 mt-1.5 font-medium">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/** Text/email input with error-aware border */
function TextInput({ id, name, type = 'text', value, onChange, onBlur, placeholder, disabled, hasError }) {
  return (
    <div className="relative flex items-center group">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={`form-input transition-all duration-150 ${value ? 'pr-8' : ''} ${
          hasError
            ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20 bg-red-500/[0.04]'
            : ''
        }`}
      />
      {value && !disabled && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => onChange({ target: { name, value: '' } })}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all duration-150 p-0.5 focus:outline-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label="Clear"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Generic Combobox — reused for both College and Field of Study.
 * Allows free-text custom entry if nothing in the list matches.
 */
function Combobox({ id, options, value, onChange, disabled, hasError, placeholder = 'Start typing…' }) {
  const [query, setQuery]             = useState(value)
  const [open, setOpen]               = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef                  = useRef(null)
  const listRef                       = useRef(null)

  const filtered = query.trim().length > 0
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  // Sync internal query when parent resets value (e.g. form reset)
  useEffect(() => { setQuery(value) }, [value])

  // Close + commit on outside click
  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (open) {
          setOpen(false)
          onChange(query) // commit free-text
        }
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [query, onChange, open])

  function handleInputChange(e) {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    setOpen(true)
    setHighlighted(-1)
  }

  function selectOption(option) {
    setQuery(option)
    onChange(option)
    setOpen(false)
    setHighlighted(-1)
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) selectOption(filtered[highlighted])
      else { setOpen(false); onChange(query) }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      listRef.current.children[highlighted]?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlighted])

  const showList = open && filtered.length > 0

  return (
    <div ref={containerRef} className="relative">
      <div className="relative group">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`form-input transition-all duration-150 ${query ? 'pr-14' : 'pr-9'} ${
            hasError
              ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20 bg-red-500/[0.04]'
              : ''
          }`}
        />
        {query && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setQuery('')
              onChange('')
              setOpen(true)
            }}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all duration-150 p-1 cursor-pointer focus:outline-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-label="Clear"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen(o => !o)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 p-1 hover:text-zinc-300 transition-colors cursor-pointer"
          aria-hidden="true"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {showList && (
        <ul
          ref={listRef}
          role="listbox"
          className="
            absolute z-50 w-full mt-1 max-h-56 overflow-y-auto
            bg-[#111118] border border-white/[0.10] rounded-lg
            shadow-[0_8px_32px_rgba(0,0,0,0.7)]
            py-1 text-[14px]
          "
        >
          {filtered.map((option, i) => {
            const idx = option.toLowerCase().indexOf(query.toLowerCase())
            return (
              <li
                key={option}
                role="option"
                aria-selected={highlighted === i}
                onMouseDown={() => selectOption(option)}
                onMouseEnter={() => setHighlighted(i)}
                className={`
                  px-4 py-2.5 cursor-pointer transition-colors duration-75 leading-snug
                  ${highlighted === i
                    ? 'bg-indigo-600/25 text-indigo-200'
                    : 'text-zinc-300 hover:bg-white/[0.05]'
                  }
                `}
              >
                {/* Highlight the matched portion in bold indigo */}
                {query.trim().length > 0 && idx !== -1 ? (
                  <>
                    {option.slice(0, idx)}
                    <span className="text-indigo-300 font-semibold">
                      {option.slice(idx, idx + query.length)}
                    </span>
                    {option.slice(idx + query.length)}
                  </>
                ) : option}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Custom Select (dark-safe, replaces native <select>) ──────────────────────

function CustomSelect({ options, value, onChange, disabled, hasError }) {
  const [open, setOpen]           = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef              = useRef(null)

  // Close on outside click
  useEffect(() => {
    function onOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  function toggle() { if (!disabled) setOpen(o => !o) }

  function select(opt) {
    onChange(opt)
    setOpen(false)
    setHighlighted(-1)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      setHighlighted(h => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open && highlighted >= 0) select(options[highlighted])
      else setOpen(true)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const displayValue = value || 'Select option…'
  const isPlaceholder = !value

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`
          form-input w-full text-left flex items-center justify-between gap-2
          transition-all duration-150
          ${isPlaceholder ? 'text-[#52525b]' : 'text-[#f4f4f5]'}
          ${hasError
            ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20 bg-red-500/[0.04]'
            : ''
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span>{displayValue}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-zinc-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          role="listbox"
          className="
            absolute z-50 w-full mt-1
            bg-[#111118] border border-white/[0.10] rounded-lg
            shadow-[0_8px_32px_rgba(0,0,0,0.7)]
            py-1 text-sm overflow-hidden
          "
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              onMouseDown={() => select(opt)}
              onMouseEnter={() => setHighlighted(i)}
              className={`
                px-4 py-2 cursor-pointer transition-colors duration-75 flex items-center justify-between
                ${value === opt
                  ? 'text-indigo-300 bg-indigo-600/20'
                  : highlighted === i
                    ? 'bg-white/[0.06] text-zinc-100'
                    : 'text-zinc-300 hover:bg-white/[0.04]'
                }
              `}
            >
              {opt}
              {value === opt && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name:    '',
    last_name:     '',
    email:         '',
    college:       '',
    year_of_study: '',
    skills:        [],
    motivation:    '',
  })

  const [errors, setErrors]               = useState({})
  const [touched, setTouched]             = useState({})
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [isSuccess, setIsSuccess]         = useState(false)

  // ── Validation ────────────────────────────────────────────────────────

  const validate = useCallback((data = formData) => {
    const e = {}
    if (!data.first_name.trim())       e.first_name    = 'First name is required'
    if (!EMAIL_RE.test(data.email))    e.email         = 'Enter a valid email address'
    if (!data.college.trim())          e.college       = 'College name is required'
    if (!data.year_of_study)           e.year_of_study = 'Select your year of study'
    if (data.skills.length === 0)      e.skills        = 'Add at least one skill'
    if (!data.motivation.trim())       e.motivation    = 'A motivation statement is required'
    else if (data.motivation.length < 50)  e.motivation = 'Minimum 50 characters required'
    else if (data.motivation.length > 500) e.motivation = 'Maximum 500 characters allowed'
    return e
  }, [formData])

  // Real-time validation on touched fields
  useEffect(() => {
    if (Object.keys(touched).length === 0) return
    const errs = validate()
    const relevantErrs = {}
    Object.keys(touched).forEach(k => { if (errs[k]) relevantErrs[k] = errs[k] })
    setErrors(relevantErrs)
  }, [formData, touched, validate])

  // ── Handlers ──────────────────────────────────────────────────────────

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  function handleCollegeChange(value) {
    setFormData(prev => ({ ...prev, college: value }))
    setTouched(prev => ({ ...prev, college: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Touch all fields
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the highlighted errors before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setIsSuccess(true)
      toast.success('Application submitted successfully!')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success state ─────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="font-display text-lg font-bold text-text-primary mb-2">
          Application received!
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
          Thank you,{' '}
          <span className="text-text-primary font-medium">{formData.first_name}</span>.
          We'll be in touch at{' '}
          <span className="text-indigo-300 font-medium">{formData.email}</span>.
        </p>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────

  const motLen = formData.motivation.length

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Name row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="first_name" label="First Name" required error={errors.first_name}>
          <TextInput
            id="first_name" name="first_name" value={formData.first_name}
            onChange={handleChange} onBlur={handleBlur}
            disabled={isSubmitting} hasError={!!errors.first_name}
          />
        </Field>

        <Field id="last_name" label="Last Name" error={errors.last_name}>
          <TextInput
            id="last_name" name="last_name" value={formData.last_name}
            onChange={handleChange} onBlur={handleBlur}
            disabled={isSubmitting} hasError={!!errors.last_name}
          />
        </Field>
      </div>

      {/* ── Email ────────────────────────────────────── */}
      <Field id="email" label="Email Address" required error={errors.email}>
        <TextInput
          id="email" name="email" type="email" value={formData.email}
          onChange={handleChange} onBlur={handleBlur}
          disabled={isSubmitting} hasError={!!errors.email}
        />
      </Field>

      {/* ── College ───────────────────────────────────── */}
      <Field id="college" label="College / University" required error={errors.college}>
        <Combobox
          id="college"
          options={COLLEGES}
          value={formData.college}
          onChange={handleCollegeChange}
          disabled={isSubmitting}
          hasError={!!errors.college}
        />
      </Field>

      {/* ── Year of Study ────────────────────────────── */}
      <Field id="year_of_study" label="Year of Study" required error={errors.year_of_study}>
        <TextInput
          id="year_of_study" name="year_of_study" value={formData.year_of_study}
          placeholder="e.g. 2nd Year, Final Year, PhD…"
          onChange={handleChange} onBlur={handleBlur}
          disabled={isSubmitting} hasError={!!errors.year_of_study}
        />
      </Field>


      {/* ── Skills ───────────────────────────────────── */}
      <Field label="Skills / Interests" required error={errors.skills}>
        <TagInput
          tags={formData.skills}
          onChange={(tags) => {
            setFormData(p => ({ ...p, skills: tags }))
            setTouched(p => ({ ...p, skills: true }))
          }}
          disabled={isSubmitting}
        />
        <p className="text-[12px] text-zinc-500 mt-1">
          Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400 text-[11px] border border-white/[0.08]">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400 text-[11px] border border-white/[0.08]">,</kbd> to add a skill
        </p>
      </Field>

      {/* ── Motivation ───────────────────────────────── */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <FieldLabel htmlFor="motivation" required>Short Motivation Statement</FieldLabel>
          <span className={`text-[12px] font-mono tabular-nums ${
            motLen > 500 ? 'text-red-400' :
            motLen >= 50 ? 'text-emerald-500' : 'text-zinc-500'
          }`}>
            {motLen}/500
          </span>
        </div>
        <textarea
          id="motivation" name="motivation"
          rows={4}
          value={formData.motivation}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          className={`form-input resize-none transition-all duration-150 ${
            errors.motivation
              ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20 bg-red-500/[0.04]'
              : ''
          }`}
        />
        {errors.motivation && (
          <p role="alert" className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5 font-medium">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {errors.motivation}
          </p>
        )}
      </div>

      {/* ── Required note ────────────────────────────── */}
      <p className="text-[12px] text-zinc-600 -mt-1">
        Fields marked <span className="text-red-400 font-bold">*</span> are required.
      </p>

      {/* ── Submit ───────────────────────────────────── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3 text-sm mt-1"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Submitting…
          </>
        ) : (
          'Submit Application →'
        )}
      </button>

    </form>
  )
}
