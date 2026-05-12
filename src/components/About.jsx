const FEATURES = [
  {
    title: 'Win Big',
    desc: 'Compete for a massive prize pool of over ₹5,000,000 across multiple tracks and challenges.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
        <path d="M12 17v4M8 21h8M6 9a6 6 0 0012 0V3H6v6z"/>
      </svg>
    ),
  },
  {
    title: 'Network',
    desc: 'Connect with 1000+ passionate students, mentors, and industry leaders from around the world.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Launch',
    desc: 'Turn your crazy ideas into reality in just 36 hours. Get support to take your project further.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Learn',
    desc: 'Attend exclusive workshops and tech talks by engineers from top tech companies.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
  },
  {
    title: 'Innovate',
    desc: 'Push boundaries. We provide the hardware, API credits, and mentors. You provide the code.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/>
      </svg>
    ),
  },
  {
    title: 'Showcase',
    desc: 'Demo your hacks to top-tier VC judges and tech recruiters looking for the next big thing.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="section-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">About the Event</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            What is InnovateFest?
          </h2>
          <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
            More than just a hackathon, InnovateFest is a 36-hour celebration of technology, creativity, and the developer community. We bring together the brightest minds to solve real-world problems.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ title, desc, icon }) => (
            <div key={title} className="card p-6 group hover:border-primary/30 transition-colors duration-200">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 transition-colors">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
