/**
 * src/components/RegistrationForm.jsx
 *
 * The actual registration form. Handles all validation client-side before
 * sending data to Supabase. The parent page (Register.jsx) only provides layout.
 *
 * Validation rules:
 *   - All fields required
 *   - Email must pass regex
 *   - At least one skill tag required
 *   - Motivation ≤ 500 chars (enforced by textarea maxLength AND DB constraint)
 *   - Duplicate email caught via Supabase error.code === '23505'
 *
 * COMMON MISTAKE: Don't rely solely on DB constraints — validate on the client
 * too, for instant feedback without a network round-trip.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { supabase } from '../lib/supabaseClient'
import TagInput from './TagInput'

// Email regex: basic but catches most invalid formats
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const YEAR_OPTIONS = [1, 2, 3, 4, 5]
const MOTIVATION_MAX = 500

const INITIAL_FORM = {
  full_name:     '',
  email:         '',
  college:       '',
  year_of_study: '',
  motivation:    '',
}

export default function RegistrationForm() {
  const navigate = useNavigate()

  const [form, setForm]       = useState(INITIAL_FORM)
  const [skills, setSkills]   = useState([])
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  // Generic field change handler — avoids one handler per field
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear the individual field error as the user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Client-side validation — returns an errors object
  const validate = () => {
    const errs = {}
    if (!form.full_name.trim())   errs.full_name     = 'Full name is required.'
    if (!form.email.trim())       errs.email         = 'Email is required.'
    else if (!EMAIL_RE.test(form.email)) errs.email  = 'Please enter a valid email address.'
    if (!form.college.trim())     errs.college       = 'College name is required.'
    if (!form.year_of_study)      errs.year_of_study = 'Please select your year of study.'
    if (skills.length === 0)      errs.skills        = 'Add at least one skill.'
    if (!form.motivation.trim())  errs.motivation    = 'Motivation is required.'
    else if (form.motivation.length > MOTIVATION_MAX)
      errs.motivation = `Motivation must be ${MOTIVATION_MAX} characters or fewer.`
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Validate locally first
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('registrations').insert([{
        full_name:     form.full_name.trim(),
        email:         form.email.trim().toLowerCase(),
        college:       form.college.trim(),
        year_of_study: parseInt(form.year_of_study, 10),
        skills,
        motivation:    form.motivation.trim(),
      }])

      if (error) {
        // 2. Handle known Supabase error codes
        if (error.code === '23505') {
          // Unique constraint violation — duplicate email
          setErrors({ email: 'This email is already registered. Did you already sign up?' })
          toast.error('This email is already registered.')
        } else {
          // Generic DB error — show raw message for debugging
          toast.error(`Registration failed: ${error.message}`)
        }
        return
      }

      // 3. Success
      toast.success('🎉 You\'re registered! See you at InnovateFest.')
      navigate('/')
    } catch (err) {
      // Network / unexpected errors
      toast.error('Something went wrong. Please check your connection and try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const remaining = MOTIVATION_MAX - form.motivation.length

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* ── Full Name ── */}
      <div>
        <label htmlFor="reg-full-name" className="block text-sm font-medium text-slate-300 mb-1.5">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="reg-full-name"
          name="full_name"
          type="text"
          value={form.full_name}
          onChange={handleChange}
          placeholder="e.g. Priya Sharma"
          autoComplete="name"
          className={`form-input ${errors.full_name ? 'border-red-500/70 focus:ring-red-500' : ''}`}
        />
        {errors.full_name && <p className="mt-1 text-red-400 text-xs">{errors.full_name}</p>}
      </div>

      {/* ── Email ── */}
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@college.edu"
          autoComplete="email"
          className={`form-input ${errors.email ? 'border-red-500/70 focus:ring-red-500' : ''}`}
        />
        {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
      </div>

      {/* ── College ── */}
      <div>
        <label htmlFor="reg-college" className="block text-sm font-medium text-slate-300 mb-1.5">
          College / University <span className="text-red-400">*</span>
        </label>
        <input
          id="reg-college"
          name="college"
          type="text"
          value={form.college}
          onChange={handleChange}
          placeholder="e.g. IIT Bombay"
          autoComplete="organization"
          className={`form-input ${errors.college ? 'border-red-500/70 focus:ring-red-500' : ''}`}
        />
        {errors.college && <p className="mt-1 text-red-400 text-xs">{errors.college}</p>}
      </div>

      {/* ── Year of Study ── */}
      <div>
        <label htmlFor="reg-year" className="block text-sm font-medium text-slate-300 mb-1.5">
          Year of Study <span className="text-red-400">*</span>
        </label>
        <select
          id="reg-year"
          name="year_of_study"
          value={form.year_of_study}
          onChange={handleChange}
          className={`form-input ${errors.year_of_study ? 'border-red-500/70 focus:ring-red-500' : ''}`}
        >
          <option value="" disabled>Select your year</option>
          {YEAR_OPTIONS.map(y => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        {errors.year_of_study && <p className="mt-1 text-red-400 text-xs">{errors.year_of_study}</p>}
      </div>

      {/* ── Skills TagInput ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Skills <span className="text-red-400">*</span>
          <span className="ml-2 text-slate-500 font-normal text-xs">(type & press Enter or comma)</span>
        </label>
        <TagInput tags={skills} onChange={setSkills} />
        {errors.skills && <p className="mt-1 text-red-400 text-xs">{errors.skills}</p>}
      </div>

      {/* ── Motivation ── */}
      <div>
        <label htmlFor="reg-motivation" className="block text-sm font-medium text-slate-300 mb-1.5">
          Why do you want to join? <span className="text-red-400">*</span>
        </label>
        <textarea
          id="reg-motivation"
          name="motivation"
          value={form.motivation}
          onChange={handleChange}
          maxLength={MOTIVATION_MAX}
          rows={4}
          placeholder="Tell us what excites you about InnovateFest and what you hope to build..."
          className={`form-input resize-none ${errors.motivation ? 'border-red-500/70 focus:ring-red-500' : ''}`}
        />
        {/* Live character countdown */}
        <div className="flex justify-between mt-1">
          {errors.motivation
            ? <p className="text-red-400 text-xs">{errors.motivation}</p>
            : <span />
          }
          <span className={`text-xs ml-auto ${remaining < 50 ? 'text-yellow-400' : 'text-slate-500'}`}>
            {remaining} characters remaining
          </span>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        id="reg-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base"
      >
        {loading ? (
          <>
            {/* Spinner */}
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Submitting…
          </>
        ) : (
          'Submit Registration →'
        )}
      </button>
    </form>
  )
}
