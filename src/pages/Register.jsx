import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RegistrationForm from '../components/RegistrationForm'

const ease = [0.22, 1, 0.36, 1]

export default function Register() {
  return (
    <main className="min-h-screen bg-surface relative overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6">

      {/* Background glows */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom right, rgba(139,92,246,0.05) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 sm:mx-auto w-full sm:max-w-md">

        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-primary transition-colors mb-8 group"
          >
            <svg className="transition-transform duration-200 group-hover:-translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to home
          </Link>
        </motion.div>

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.06 }}
          className="mb-8"
        >
          <p className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 uppercase tracking-[0.16em] mb-3">
            <span className="w-4 h-[1px] bg-indigo-500" />
            Registration
          </p>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] font-extrabold text-text-primary leading-tight tracking-tight mb-2">
            Apply to InnovateFest 2026
          </h1>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Free to attend. Registrations close{' '}
            <span className="text-text-primary font-medium">May 20, 2026</span>.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.12 }}
          className="card-elevated px-6 py-8 sm:px-8"
        >
          <RegistrationForm />
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-[11px] font-mono text-text-muted text-center mt-5"
        >
          By registering you agree to our Code of Conduct and Privacy Policy.
        </motion.p>

      </div>
    </main>
  )
}
