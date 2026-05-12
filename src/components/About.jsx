/**
 * src/components/About.jsx
 *
 * Event description section with feature cards.
 * WHY feature cards instead of a wall of text: scannable, visually richer,
 * and each icon reinforces the key benefit.
 */

// Feature data kept in a constant — easy to edit without touching JSX
const FEATURES = [
  {
    icon: '🏆',
    title: 'Win Big',
    desc:  'Compete for ₹1,00,000 in prizes across 5 innovative tracks.',
  },
  {
    icon: '🤝',
    title: 'Network',
    desc:  'Connect with 500+ students, mentors, and industry leaders from top companies.',
  },
  {
    icon: '🚀',
    title: 'Launch',
    desc:  'Turn your idea into a working prototype in just 36 hours with expert guidance.',
  },
  {
    icon: '🎓',
    title: 'Learn',
    desc:  'Attend workshops on AI/ML, Web3, Cloud, and Design Thinking throughout the event.',
  },
  {
    icon: '💡',
    title: 'Innovate',
    desc:  'Tackle real-world challenges across HealthTech, EdTech, FinTech, Green Tech, and Open Innovation.',
  },
  {
    icon: '🌐',
    title: 'Showcase',
    desc:  'Present your project to a panel of judges from leading tech companies and startups.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      {/* Subtle top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-600/40 to-transparent" />

      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">
            About the Event
          </p>
          <h2 className="section-title mb-4">
            What is <span className="gradient-text">InnovateFest?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            InnovateFest is a 36-hour national student hackathon bringing together the brightest 
            minds from colleges across India. Whether you're a coder, designer, or domain expert — 
            there's a track for you.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass-card p-6 group hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
