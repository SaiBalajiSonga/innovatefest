import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-[56px] transition-all duration-300 ${
        scrolled
          ? 'bg-surface-1/80 backdrop-blur-xl border-b border-surface-border shadow-lg'
          : 'bg-surface-1/80 backdrop-blur-xl border-b border-surface-border'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => scrollTo(e, 'hero')}
          className="font-display font-semibold text-sm text-text-primary hover:opacity-80 transition-opacity"
        >
          InnovateFest
        </a>

        {/* Navigation Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            onClick={(e) => scrollTo(e, 'about')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            About
          </a>
          <a
            href="#timeline"
            onClick={(e) => scrollTo(e, 'timeline')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Timeline
          </a>
          <a
            href="#faq"
            onClick={(e) => scrollTo(e, 'faq')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/register"
            className="btn-primary px-4 py-1.5 text-xs rounded-md"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}
