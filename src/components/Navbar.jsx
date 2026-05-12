/**
 * src/components/Navbar.jsx
 *
 * Sticky navigation bar with a glassmorphism effect that activates on scroll.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll to toggle the glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Helper for smooth scrolling to sections
  const scrollTo = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-950/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => scrollTo(e, 'hero')}
          className="font-display text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="gradient-text">InnovateFest</span>
        </a>

        {/* Navigation Links (Hidden on small screens to keep it minimal) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            onClick={(e) => scrollTo(e, 'about')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#timeline"
            onClick={(e) => scrollTo(e, 'timeline')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Timeline
          </a>
          <a
            href="#faq"
            onClick={(e) => scrollTo(e, 'faq')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/register"
            className="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
          >
            Register Now
          </Link>
        </div>
      </div>
    </nav>
  )
}
