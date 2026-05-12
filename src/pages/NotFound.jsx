import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="relative z-10 text-center"
      >
        <p className="font-mono text-[80px] sm:text-[120px] font-extrabold leading-none text-white/[0.04] select-none mb-4">
          404
        </p>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-3 -mt-4">
          Page not found.
        </h1>
        <p className="text-[13px] text-text-secondary max-w-[280px] mx-auto mb-8">
          The URL you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary text-sm px-5 py-2.5">
          Back to home
        </Link>
      </motion.div>
    </main>
  )
}
