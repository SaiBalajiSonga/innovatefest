/**
 * src/pages/Register.jsx
 *
 * Registration page wrapper. Provides layout, heading, and back link.
 * The form itself is in RegistrationForm.jsx to keep this file focused on layout.
 */
import { Link } from 'react-router-dom'
import RegistrationForm from '../components/RegistrationForm'

export default function Register() {
  return (
    <main className="min-h-screen bg-brand-950 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-300 text-sm font-medium mb-10 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
            Register for <span className="gradient-text">InnovateFest 2026</span>
          </h1>
          <p className="text-slate-400">
            Fill in your details below. Registrations close on <strong className="text-slate-300">May 20, 2026</strong>.
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card p-6 sm:p-8">
          <RegistrationForm />
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          By registering, you agree to abide by the InnovateFest Code of Conduct.
        </p>
      </div>
    </main>
  )
}
