import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import TagInput from './TagInput'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    full_name:    '',
    email:        '',
    college:      '',
    year_of_study: '',
    skills:       [],
    motivation:   '',
  })

  const [errors, setErrors]         = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess]   = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.full_name.trim())      e.full_name    = 'Required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) e.email  = 'Valid email required'
    if (!formData.college.trim())        e.college      = 'Required'
    if (!formData.year_of_study)         e.year_of_study = 'Required'
    if (formData.skills.length === 0)    e.skills       = 'Add at least one skill'
    if (!formData.motivation.trim())     e.motivation   = 'Required'
    else if (formData.motivation.length < 50)  e.motivation = 'Minimum 50 characters'
    else if (formData.motivation.length > 500) e.motivation = 'Maximum 500 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) { toast.error('Fix the errors below'); return }
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('registrations').insert([{
        full_name:    formData.full_name,
        email:        formData.email,
        college:      formData.college,
        year_of_study: formData.year_of_study,
        skills:       formData.skills,
        motivation:   formData.motivation,
      }])
      if (error) {
        if (error.code === '23505') throw new Error('This email is already registered.')
        throw error
      }
      setIsSuccess(true)
      toast.success('Application submitted!')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Submission failed. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="font-display text-[1.125rem] font-bold text-text-primary mb-2">Application received.</h3>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          We'll be in touch at{' '}
          <span className="text-text-primary font-medium">{formData.email}</span>.
        </p>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────

  const Field = ({ id, label, error, children }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400 mt-1.5 font-mono">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <Field id="full_name" label="Full Name" error={errors.full_name}>
        <input
          type="text" id="full_name" name="full_name"
          value={formData.full_name} onChange={handleChange}
          className="form-input" placeholder="Jane Doe"
          disabled={isSubmitting}
        />
      </Field>

      <Field id="email" label="Email Address" error={errors.email}>
        <input
          type="email" id="email" name="email"
          value={formData.email} onChange={handleChange}
          className="form-input" placeholder="jane@university.edu"
          disabled={isSubmitting}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="college" label="College" error={errors.college}>
          <input
            type="text" id="college" name="college"
            value={formData.college} onChange={handleChange}
            className="form-input" placeholder="MIT"
            disabled={isSubmitting}
          />
        </Field>

        <Field id="year_of_study" label="Year of Study" error={errors.year_of_study}>
          <select
            id="year_of_study" name="year_of_study"
            value={formData.year_of_study} onChange={handleChange}
            className="form-input" disabled={isSubmitting}
          >
            <option value="">Select</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </Field>
      </div>

      <Field label="Skills / Interests" error={errors.skills}>
        <TagInput
          tags={formData.skills}
          onChange={(tags) => {
            setFormData(p => ({ ...p, skills: tags }))
            if (errors.skills && tags.length > 0) setErrors(p => ({ ...p, skills: '' }))
          }}
          disabled={isSubmitting}
        />
      </Field>

      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label htmlFor="motivation" className="label mb-0">Short Motivation Statement</label>
          <span className={`text-[11px] font-mono tabular-nums ${
            formData.motivation.length > 500 ? 'text-red-400' :
            formData.motivation.length >= 50 ? 'text-emerald-500' : 'text-text-muted'
          }`}>
            {formData.motivation.length}/500
          </span>
        </div>
        <textarea
          id="motivation" name="motivation"
          rows={4}
          value={formData.motivation} onChange={handleChange}
          className="form-input resize-none"
          placeholder="What do you want to build and why? (min 50 chars)"
          disabled={isSubmitting}
        />
        {errors.motivation && <p className="text-[11px] text-red-400 mt-1.5 font-mono">{errors.motivation}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-2.5 text-[13px] mt-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Submitting…
          </>
        ) : (
          'Submit application'
        )}
      </button>

    </form>
  )
}
