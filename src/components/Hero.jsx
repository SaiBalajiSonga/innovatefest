import { Link } from 'react-router-dom'

const STATS = [
  { label: 'Hours', value: '36' },
  { label: 'Tracks', value: '5' },
  { label: 'Prizes', value: '₹5L' },
]

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Layer 1: base surface (handled by body) */}
      
      {/* Background Layer 2: CSS dot grid texture */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Background Layer 3: radial glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-4 py-1.5 rounded-full mb-10">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse-slow" />
          InnovateFest 2026 &nbsp;·&nbsp; May 25–27
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6">
          <span className="text-text-primary">Build Something</span>
          <br />
          <span className="gradient-text">That Matters.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          36 hours. 5 tracks. India's premier student hackathon — open to every builder, designer, and domain expert.
        </p>

        {/* CTA row */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <Link to="/register" className="btn-primary px-6 py-3 text-sm">
            Register Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a href="#about" className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
            View Schedule
          </a>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center divide-x divide-surface-border">
          {STATS.map(({ label, value }) => (
            <div key={label} className="px-8 first:pl-0 last:pr-0 text-center">
              <div className="font-display text-2xl font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-muted uppercase tracking-widest mt-0.5 font-mono">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
