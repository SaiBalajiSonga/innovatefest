import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const NAV = [
    { label: 'About',    id: 'about' },
    { label: 'Timeline', id: 'timeline' },
    { label: 'FAQ',      id: 'faq' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => scrollTo(e, 'hero')}
            className="font-display font-semibold text-[13px] tracking-tight text-text-primary hover:text-white transition-colors"
          >
            Innovate<span className="text-indigo-400">Fest</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollTo(e, id)}
                className="text-[13px] text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-white/[0.05] transition-all duration-150"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/register" className="btn-primary text-xs px-3.5 py-1.5 rounded-md">
              Register Now
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px] text-text-muted hover:text-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`w-4 h-[1.5px] bg-current transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`w-4 h-[1.5px] bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-4 h-[1.5px] bg-current transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 inset-x-0 z-40 md:hidden bg-[#111118]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-4 space-y-1"
          >
            {NAV.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollTo(e, id)}
                className="block text-sm text-text-secondary hover:text-text-primary px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
