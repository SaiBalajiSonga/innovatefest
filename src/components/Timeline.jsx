const SCHEDULE = [
  {
    date: 'May 1',
    time: '12:00 AM',
    title: 'Registration Opens',
    desc: 'Secure your spot! We accept applications on a rolling basis until capacity is reached.',
  },
  {
    date: 'May 20',
    time: '11:59 PM',
    title: 'Registration Closes',
    desc: 'Last chance to register. Team formations must be finalized by this date.',
  },
  {
    date: 'May 25',
    time: '09:00 AM',
    title: 'Opening Ceremony',
    desc: 'Kickoff! Keynote speakers, theme announcements, and track details revealed.',
  },
  {
    date: 'May 25',
    time: '11:00 AM',
    title: 'Hacking Begins',
    desc: '36 hours on the clock. Get coding! Mentors will be circulating to help you brainstorm.',
  },
  {
    date: 'May 26',
    time: '11:00 PM',
    title: 'Hacking Ends',
    desc: 'Pens down, keyboards away. Submit your projects to Devpost for judging.',
  },
  {
    date: 'May 27',
    time: '03:00 PM',
    title: 'Closing Ceremony & Winners',
    desc: 'Live demos from top 10 teams, prize distributions, and closing notes.',
  },
]

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 bg-surface-1">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-3">Schedule</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Event Timeline
          </h2>
        </div>

        {/* Timeline container */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical connecting line */}
          <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-surface-border md:left-1/2 md:-translate-x-1/2" />

          {/* Timeline Events */}
          <div className="space-y-8">
            {SCHEDULE.map(({ date, time, title, desc }, idx) => {
              // Highlight the upcoming event (for demo, assuming 3rd event is active)
              const isActive = idx === 2;

              return (
                <div key={title} className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-8 h-8">
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs md:mx-auto transition-colors duration-300 ${isActive ? 'border-primary/60 text-primary bg-surface-1' : 'border-surface-border bg-surface-2 text-text-muted'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Card wrapper */}
                  <div className="ml-12 md:ml-0 flex-1 md:w-1/2 flex flex-col group">
                    <div className={`card p-4 flex-1 transition-colors duration-200 md:max-w-[calc(100%-1.5rem)] ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} ${isActive ? 'border-primary/40' : 'hover:border-surface-border/80'}`}>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-primary">{date}</span>
                        <span className="text-surface-border text-xs">·</span>
                        <span className="font-mono text-xs text-text-muted">{time}</span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </section>
  )
}
