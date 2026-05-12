import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import TagInput from './TagInput'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    college: '',
    year_of_study: '',
    skills: [],
    motivation: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required'
    if (!formData.college.trim()) newErrors.college = 'College is required'
    if (!formData.year_of_study) newErrors.year_of_study = 'Year of study is required'
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill'
    
    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please tell us why you want to join'
    } else if (formData.motivation.length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters'
    } else if (formData.motivation.length > 500) {
      newErrors.motivation = 'Motivation must be under 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          college: formData.college,
          year_of_study: formData.year_of_study,
          skills: formData.skills,
          motivation: formData.motivation
        }])

      if (error) {
        if (error.code === '23505') {
          throw new Error('An application with this email already exists.')
        }
        throw error
      }

      setIsSuccess(true)
      toast.success('Registration submitted successfully!')
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-900/60 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Application Received!</h3>
        <p className="text-sm text-text-secondary">
          Thank you for applying to InnovateFest. We will review your application and get back to you shortly at <strong className="text-text-primary">{formData.email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      
      <div>
        <label htmlFor="full_name" className="label">Full Name</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="form-input"
          placeholder="Jane Doe"
          disabled={isSubmitting}
        />
        {errors.full_name && <p className="text-xs text-red-400 mt-1.5">{errors.full_name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="jane@university.edu"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="college" className="label">College</label>
          <input
            type="text"
            id="college"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="form-input"
            placeholder="MIT"
            disabled={isSubmitting}
          />
          {errors.college && <p className="text-xs text-red-400 mt-1.5">{errors.college}</p>}
        </div>

        <div>
          <label htmlFor="year_of_study" className="label">Year of Study</label>
          <select
            id="year_of_study"
            name="year_of_study"
            value={formData.year_of_study}
            onChange={handleChange}
            className="form-input"
            disabled={isSubmitting}
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
          {errors.year_of_study && <p className="text-xs text-red-400 mt-1.5">{errors.year_of_study}</p>}
        </div>
      </div>

      <div>
        <label className="label">
          Skills / Interests
          <span className="text-xs font-mono text-text-muted ml-1">(Press enter to add)</span>
        </label>
        <TagInput 
          tags={formData.skills} 
          onChange={(newTags) => {
            setFormData(prev => ({ ...prev, skills: newTags }))
            if (errors.skills && newTags.length > 0) setErrors(prev => ({ ...prev, skills: '' }))
          }}
          disabled={isSubmitting}
        />
        {errors.skills && <p className="text-xs text-red-400 mt-1.5">{errors.skills}</p>}
      </div>

      <div>
        <div className="flex justify-between items-end mb-1.5">
          <label htmlFor="motivation" className="label mb-0">Short Motivation Statement</label>
          <span className={`text-xs font-mono ${
            formData.motivation.length < 50 ? 'text-amber-500' : 
            formData.motivation.length > 500 ? 'text-red-400' : 'text-text-muted'
          }`}>
            {formData.motivation.length} / 500
          </span>
        </div>
        <textarea
          id="motivation"
          name="motivation"
          rows="4"
          value={formData.motivation}
          onChange={handleChange}
          className="form-input resize-none"
          placeholder="Tell us about your hackathon goals, what you want to build, or what you hope to learn... (min 50 chars)"
          disabled={isSubmitting}
        />
        {errors.motivation && <p className="text-xs text-red-400 mt-1.5">{errors.motivation}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3 text-sm mt-4 flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>

    </form>
  )
}
