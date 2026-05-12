/**
 * src/components/Hero.jsx
 *
 * Full-viewport hero section with animated gradient background,
 * floating orb decorations, headline, sub-text, CTA button, and stat pills.
 *
 * WHY orbs: Creates depth without a heavy image. Pure CSS, fast to render.
 * COMMON MISTAKE: Don't put the gradient on <body>; keep it scoped here so
 * other pages can have a clean dark background.
 */
import { Link } from 'react-router-dom'

// Static event stats shown under the CTA
const STATS = [
  { label: 'Cash Prize', value: '₹1,00,000' },
  { label: 'Participants',  value: '500+'     },
  { label: 'Hours',         value: '36'       },
  { label: 'Tracks',        value: '5'        },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4"
    >
      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-800/60 via-brand-950 to-brand-950 pointer-events-none" />

      {/* ── Decorative glowing orbs ── */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto animate-slide-up">
        {/* Event badge */}
        <div className="inline-flex items-center gap-2 bg-brand-800/60 border border-brand-600/40 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Registrations Open — May 2025
        </div>

        {/* Main headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
          <span className="gradient-text">InnovateFest</span>
          <br />
          <span className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">2025</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-slate-300 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
          36 hours. 5 tracks. Endless possibilities.
          <br className="hidden sm:block" />
          Build something that matters at India's premier student hackathon.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Register Now →
          </Link>
          <a href="#about" className="btn-secondary text-lg px-8 py-4">
            Learn More
          </a>
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="glass-card px-4 py-3 flex flex-col items-center"
            >
              <span className="font-display text-2xl font-bold gradient-text">{value}</span>
              <span className="text-slate-400 text-xs mt-0.5 uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
